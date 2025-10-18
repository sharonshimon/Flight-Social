import ChatMessage from "../models/ChatMessage.js";
import { verifyToken } from "../services/authService.js";

export const getConversation = async (req, res) => {
  try {
    verifyToken(req);
    const { userId, peerId } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    const skip = parseInt(req.query.skip) || 0;

    const messages = await ChatMessage.find({
      $or: [
        { senderId: userId, receiverId: peerId },
        { senderId: peerId, receiverId: userId }
      ]
    })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.status(200).json({ data: messages });
  } catch (err) {
    res.status(400).json({ message: "Failed to fetch conversation", error: err.message });
  }
};

export const listConversations = async (req, res) => {
  try {
    if (!req.headers?.authorization) {
      console.warn('listConversations: missing Authorization header');
      return res.status(401).json({ message: 'Missing Authorization header' });
    }

    const user = verifyToken(req);
    const userId = String(user.id);

    // defensive logging for debugging
    console.debug('listConversations: userId=', userId);

    // Aggregate last message per peer
  const conv = await ChatMessage.aggregate([
      {
        $match: {
          $or: [{ senderId: userId }, { receiverId: userId }]
        }
      },
      {
        $project: {
          peer: {
            $cond: [{ $eq: ["$senderId", userId] }, "$receiverId", "$senderId"]
          },
          content: 1,
          createdAt: 1,
          senderId: 1,
          receiverId: 1
        }
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$peer",
          lastMessage: { $first: "$content" },
          lastAt: { $first: "$createdAt" }
        }
      },
        { $sort: { lastAt: -1 } },
        // Attach user metadata by converting the string id to ObjectId where possible
        {
          $addFields: {
            peerObjectId: {
              $convert: { input: "$_id", to: "objectId", onError: null, onNull: null }
            }
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "peerObjectId",
            foreignField: "_id",
            as: "peerUser"
          }
        },
        { $unwind: { path: "$peerUser", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 1,
            lastMessage: 1,
            lastAt: 1,
            peerUsername: "$peerUser.username",
            peerDisplayName: { $ifNull: ["$peerUser.username", { $concat: ["$peerUser.firstName", " ", "$peerUser.lastName"] }] },
            peerAvatar: "$peerUser.profilePicture"
          }
        }
    ]);

    res.status(200).json({ data: conv });
  } catch (err) {
    console.error('listConversations error:', err.stack || err);
    res.status(500).json({ message: 'Failed to list conversations', error: err.message });
  }
};

// Start a conversation by creating an initial message (or placeholder)
export const startConversation = async (req, res) => {
  try {
    if (!req.headers?.authorization) {
      console.warn('startConversation: missing Authorization header');
      return res.status(401).json({ message: 'Missing Authorization header' });
    }

  const user = verifyToken(req);
  const userId = String(user.id);
  // Normalize request body to support several client behaviors:
  // - req.body may be undefined (no body or unsupported content-type)
  // - req.body may be a raw string (text/plain) containing JSON or urlencoded data
  let body = req.body;

  if (!body) {
    console.warn('startConversation: req.body is undefined; check Content-Type header and body parser middleware');
    body = {};
  } else if (typeof body === 'string') {
    // Try JSON.parse first, then try URLSearchParams parsing (form-encoded)
    try {
      body = JSON.parse(body);
    } catch (jsonErr) {
      try {
        const params = new URLSearchParams(body);
        body = Object.fromEntries(params.entries());
      } catch (qsErr) {
        console.warn('startConversation: req.body is a string but could not be parsed as JSON or urlencoded');
        body = {};
      }
    }
  }

  const { peerId, peerUsername, content = '', messageType = 'text', isRead, readAt, editedAt, isDeleted } = body;

  console.log('startConversation: userId=', userId, 'peerId=', peerId, 'peerUsername=', peerUsername, 'bodyType=', typeof req.body);

    // find peer by id or username
    let targetId = peerId;
    if (!targetId && peerUsername) {
      const User = (await import('../models/User.js')).default;
      const found = await User.findOne({ username: peerUsername.toLowerCase() }).lean();
      if (found) targetId = String(found._id);
    }

    if (!targetId) return res.status(400).json({ message: 'peerId or peerUsername required' });

    // ensure we have proper display names for required fields
    let senderName = user.username || '';
    let receiverName = peerUsername || '';
    const UserModel = (await import('../models/User.js')).default;
    // fetch receiver details if needed
    if (!receiverName) {
      try {
        const recv = await UserModel.findById(targetId).lean();
        if (recv) receiverName = recv.username || `${recv.firstName || ''} ${recv.lastName || ''}`.trim();
      } catch (er) {
        console.warn('Could not lookup receiver user for name population', er.message);
      }
    }

    // if senderName is missing, try to look up current user
    if (!senderName) {
      try {
        const me = await UserModel.findById(userId).lean();
        if (me) senderName = me.username || `${me.firstName || ''} ${me.lastName || ''}`.trim();
      } catch (er) {
        console.warn('Could not lookup sender user for name population', er.message);
      }
    }

    // Build payload and include optional fields if provided by client
    const payload = {
      senderId: userId,
      senderName: senderName || 'Unknown',
      receiverId: targetId,
      receiverName: receiverName || 'Unknown',
      content,
      messageType
    };

    if (peerUsername) payload.peerUsername = peerUsername;

    if (typeof isRead !== 'undefined') payload.isRead = Boolean(isRead);
    if (typeof isDeleted !== 'undefined') payload.isDeleted = Boolean(isDeleted);
    if (readAt) payload.readAt = new Date(readAt);
    if (editedAt) payload.editedAt = new Date(editedAt);

  const msg = await ChatMessage.create(payload);

  // Return the full created message object (plain JS object) so all model fields
  // including defaults and timestamps are present in the JSON response.
  const out = msg.toObject();
  // Echo back peerUsername if the client supplied it (helpful for client-side mapping)
  if (peerUsername) out.peerUsername = peerUsername;

  return res.status(201).json(out);
  } catch (err) {
    // Improved diagnostics for debugging 500 errors
    console.error('startConversation error:', err.stack || err);
    try {
      console.error('startConversation req.body type:', typeof req.body, 'req.body:', req.body);
    } catch (logErr) {
      console.error('Could not log req.body:', logErr.message);
    }
    try {
      const user = req && req.headers && req.headers.authorization ? 'has auth header' : 'no auth header';
      console.error('startConversation auth header present?:', Boolean(req.headers && req.headers.authorization), user);
    } catch (logErr) {
      console.error('Could not log auth header presence:', logErr.message);
    }

    return res.status(500).json({ message: 'Failed to start conversation', error: err.message });
  }
};
