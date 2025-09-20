import "./rightbar.css";
import SuggestionUser from "./SuggestionUser";
import OnlineFriend from "./OnlineFriend";

const RightBar = () => {
  return (
    <div className="rightBar">
      <div className="container">
        <div className="item">
          <span>Suggestions For You</span>
          <SuggestionUser
            img="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
            name="Jane Doe"
          />
          <SuggestionUser
            img="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
            name="Jane Doe"
          />
        </div>
        <span>Latest Activities</span>
        {[...Array(4)].map((_, i) => (
          <div className="user" key={i}>
            <div className="userInfo">
              <img
                src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt=""
              />
              <p>
                <span>Jane Doe</span> changed their cover picture
              </p>
            </div>
            <span>1 min ago</span>
          </div>
        ))}
        <div className="item">
          <span>Online Friends</span>
          <div className="onlineFriendsScroll">
            {[...Array(11)].map((_, i) => (
              <OnlineFriend
                key={i}
                img="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
                name="Jane Doe"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightBar;