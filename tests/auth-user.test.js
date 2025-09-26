// // // __tests__/userAuthService.test.js
// // //import { jest } from "@jest/globals";

// // import { registerUser, loginUser } from "@server/services/authService.js";
// // import {
// //     getUserProfile,
// //     updateUser,
// //     getUserFriends,
// //     followUser,
// //     unfollowUser
// // } from "@server/services/userService.js";
// // import UserModel from "@server/models/User.js";
// // import bcrypt from "bcrypt";
// // import jwt from "jsonwebtoken";

// // // נשתמש ב־jest.mock כדי לדמות את המודולים
// // jest.mock("@server/models/User.js");
// // jest.mock("bcrypt");
// // jest.mock("jsonwebtoken");

// // // פונקציית עזר למניעת חזרות מיותרות
// // const mockFindByIdSequence = (results) => {
// //     results.forEach((res) => {
// //         UserModel.findById.mockResolvedValueOnce(res);
// //     });
// // };

// // describe("Auth & User Services", () => {
// //     beforeEach(() => {
// //         jest.clearAllMocks();
// //     });

// //     // === AUTH TESTS ===
// //     describe("register", () => {
// //         it("should create and save a new user", async () => {
// //             bcrypt.hash.mockResolvedValue("hashedPass");
// //             UserModel.prototype.save = jest.fn().mockResolvedValue(true);

// //             const user = { username: "stav", email: "s@test.com", password: "123456" };
// //             const result = await registerUser(user);

// //             expect(bcrypt.hash).toHaveBeenCalledWith("123456", 10);
// //             expect(UserModel.prototype.save).toHaveBeenCalled();
// //             expect(result).toHaveProperty("username", "stav");
// //         });
// //     });

// //     // describe("login", () => {
// //     //     it("should return token when credentials are valid", async () => {
// //     //         const user = { _id: "1", email: "s@test.com", password: "hashed" };
// //     //         UserModel.findOne.mockResolvedValue(user);
// //     //         bcrypt.compare.mockResolvedValue(true);
// //     //         jwt.sign.mockReturnValue("token123");

// //     //         const result = await loginUser({ email: "s@test.com", password: "123456" });
// //     //         expect(result).toEqual({ token: "token123", user });
// //     //     });

// //     //     it("should throw error if user not found", async () => {
// //     //         UserModel.findOne.mockResolvedValue(null);
// //     //         await expect(loginUser({ email: "no@test.com", password: "123" }))
// //     //             .rejects.toThrow("User not found");
// //     //     });
// //     // });

// //     describe("login", () => {
// //         it("should return token when credentials are valid", async () => {
// //             const user = {
// //                 _id: "1",
// //                 email: "s@test.com",
// //                 password: "hashed",
// //                 comparePassword: jest.fn().mockResolvedValue(true) // מדמים את comparePassword
// //             };
// //             UserModel.findOne.mockResolvedValue(user);
// //             jwt.sign.mockReturnValue("token123");

// //             const result = await loginUser({ email: "s@test.com", password: "123456" });

// //             expect(user.comparePassword).toHaveBeenCalledWith("123456"); // בודקים שהמתודה נקראה
// //             expect(result).toEqual({ user, token: "token123" });
// //         });

// //         it("should throw error if user not found", async () => {
// //             UserModel.findOne.mockResolvedValue(null);
// //             await expect(loginUser({ email: "no@test.com", password: "123" }))
// //                 .rejects.toThrow("User not found");
// //         });
// //     });

// //     // === USER TESTS ===
// //     describe("getUserProfile", () => {
// //         it("should return user if found", async () => {
// //             const mockUser = { _id: "1", username: "stav" };
// //             UserModel.findById.mockResolvedValue(mockUser);

// //             const result = await getUserProfile("1");
// //             expect(result).toEqual(mockUser);
// //         });

// //         it("should throw error if user not found", async () => {
// //             UserModel.findById.mockResolvedValue(null);
// //             await expect(getUserProfile("2")).rejects.toThrow("User not found");
// //         });
// //     });

// //     describe("updateUser", () => {
// //         it("should update and return user", async () => {
// //             const mockUser = { _id: "1", username: "stav" };
// //             UserModel.findByIdAndUpdate.mockResolvedValue(mockUser);

// //             const result = await updateUser("1", { username: "stav" });
// //             expect(result).toEqual(mockUser);
// //         });

// //         it("should throw if user not found", async () => {
// //             UserModel.findByIdAndUpdate.mockResolvedValue(null);
// //             await expect(updateUser("404", { username: "x" })).rejects.toThrow("User not found");
// //         });
// //     });

// //     describe("getUserFriends", () => {
// //         it("should return friends list", async () => {
// //             const mockUser = { _id: "1", friends: ["2", "3"] };
// //             const friend1 = { _id: "2", username: "A" };
// //             const friend2 = { _id: "3", username: "B" };

// //             UserModel.findById.mockResolvedValueOnce(mockUser);
// //             mockFindByIdSequence([friend1, friend2]);

// //             const result = await getUserFriends("1");
// //             expect(result).toEqual([friend1, friend2]);
// //         });

// //         it("should throw if user not found", async () => {
// //             UserModel.findById.mockResolvedValue(null);
// //             await expect(getUserFriends("404")).rejects.toThrow("User not found");
// //         });
// //     });

// //     describe("followUser", () => {
// //         it("should add following and follower", async () => {
// //             const user = { _id: "1", followings: [], save: jest.fn() };
// //             const target = { _id: "2", followers: [], save: jest.fn() };

// //             UserModel.findById
// //                 .mockResolvedValueOnce(user)
// //                 .mockResolvedValueOnce(target);

// //             const result = await followUser("1", "2");

// //             expect(user.followings).toContain("2");
// //             expect(target.followers).toContain("1");
// //             expect(result).toEqual({ message: "User followed successfully" });
// //         });

// //         it("should throw if target user not found", async () => {
// //             UserModel.findById
// //                 .mockResolvedValueOnce({ _id: "1", followings: [], save: jest.fn() })
// //                 .mockResolvedValueOnce(null);

// //             await expect(followUser("1", "404")).rejects.toThrow("Target user not found");
// //         });
// //     });

// //     describe("unfollowUser", () => {
// //         it("should remove following and follower", async () => {
// //             const user = { _id: "1", followings: ["2"], save: jest.fn() };
// //             const target = { _id: "2", followers: ["1"], save: jest.fn() };

// //             UserModel.findById
// //                 .mockResolvedValueOnce(user)
// //                 .mockResolvedValueOnce(target);

// //             const result = await unfollowUser("1", "2");

// //             expect(user.followings).not.toContain("2");
// //             expect(target.followers).not.toContain("1");
// //             expect(result).toEqual({ message: "User unfollowed successfully" });
// //         });

// //         it("should throw if target user not found", async () => {
// //             UserModel.findById
// //                 .mockResolvedValueOnce({ _id: "1", followings: [], save: jest.fn() })
// //                 .mockResolvedValueOnce(null);

// //             await expect(unfollowUser("1", "404")).rejects.toThrow("Target user not found");
// //         });
// //     });
// // });





// // __tests__/userAuthService.test.js
// import { registerUser, loginUser } from "@server/services/authService.js";
// import {
//     getUserProfile,
//     updateUser,
//     getUserFriends,
//     followUser,
//     unfollowUser
// } from "@server/services/userService.js";
// import UserModel from "@server/models/User.js";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";

// jest.mock("@server/models/User.js");
// jest.mock("bcrypt");
// jest.mock("jsonwebtoken");

// const mockFindByIdSequence = (results) => {
//     results.forEach((res) => {
//         UserModel.findById.mockResolvedValueOnce(res);
//     });
// };

// describe("Auth & User Services", () => {
//     beforeAll(() => {
//         process.env.JWT_SECRET = "testSecret"; // JWT_SECRET ל־tests
//     });

//     beforeEach(() => {
//         jest.clearAllMocks();
//     });

//     // === REGISTER ===
//     describe("register", () => {
//         it("should create and save a new user", async () => {
//             jest.spyOn(bcrypt, "hash").mockResolvedValue("hashedPass");
//             UserModel.prototype.save = jest.fn().mockResolvedValue(true);

//             const user = { username: "stav", email: "s@test.com", password: "123456" };
//             const result = await registerUser(user);

//             expect(bcrypt.hash).toHaveBeenCalledWith("123456", 10);
//             expect(UserModel.prototype.save).toHaveBeenCalled();
//             expect(result).toHaveProperty("username", "stav");
//         });
//     });

//     // === LOGIN ===
//     describe("login", () => {
//         it("should return token when credentials are valid", async () => {
//             const user = {
//                 _id: "1",
//                 email: "s@test.com",
//                 username: "stav",
//                 password: "hashed",
//                 comparePassword: jest.fn().mockResolvedValue(true)
//             };
//             UserModel.findOne.mockResolvedValue(user);
//             jest.spyOn(jwt, "sign").mockReturnValue("token123");

//             const result = await loginUser({ email: "s@test.com", password: "123456" });

//             expect(user.comparePassword).toHaveBeenCalledWith("123456");
//             expect(result).toEqual({ user, token: "token123" });
//         });

//         it("should throw error if user not found", async () => {
//             UserModel.findOne.mockResolvedValue(null);
//             await expect(loginUser({ email: "no@test.com", password: "123" }))
//                 .rejects.toThrow("User not found");
//         });

//         it("should throw error if password is invalid", async () => {
//             const user = {
//                 _id: "1",
//                 email: "s@test.com",
//                 password: "hashed",
//                 comparePassword: jest.fn().mockResolvedValue(false)
//             };
//             UserModel.findOne.mockResolvedValue(user);
//             await expect(loginUser({ email: "s@test.com", password: "wrong" }))
//                 .rejects.toThrow("Invalid password");
//         });
//     });

//     // === GET USER PROFILE ===
//     describe("getUserProfile", () => {
//         it("should return user if found", async () => {
//             const mockUser = { _id: "1", username: "stav" };
//             UserModel.findById.mockResolvedValue(mockUser);

//             const result = await getUserProfile("1");
//             expect(result).toEqual(mockUser);
//         });

//         it("should throw error if user not found", async () => {
//             UserModel.findById.mockResolvedValue(null);
//             await expect(getUserProfile("404")).rejects.toThrow("User not found");
//         });
//     });

//     // === UPDATE USER ===
//     describe("updateUser", () => {
//         it("should update and return user", async () => {
//             const mockUser = { _id: "1", username: "stav" };
//             UserModel.findByIdAndUpdate.mockResolvedValue(mockUser);

//             const result = await updateUser("1", { username: "stav" });
//             expect(result).toEqual(mockUser);
//         });

//         it("should throw if user not found", async () => {
//             UserModel.findByIdAndUpdate.mockResolvedValue(null);
//             await expect(updateUser("404", { username: "x" })).rejects.toThrow("User not found");
//         });
//     });

//     // === GET USER FRIENDS ===
//     describe("getUserFriends", () => {
//         it("should return friends list", async () => {
//             const mockUser = { _id: "1", followings: ["2", "3"] };
//             const friend1 = { _id: "2", username: "A" };
//             const friend2 = { _id: "3", username: "B" };

//             UserModel.findById.mockResolvedValueOnce(mockUser);
//             mockFindByIdSequence([friend1, friend2]);

//             const result = await getUserFriends("1");
//             expect(result).toEqual([friend1, friend2]);
//         });

//         it("should throw if user not found", async () => {
//             UserModel.findById.mockResolvedValue(null);
//             await expect(getUserFriends("404")).rejects.toThrow("User not found");
//         });
//     });

//     // === FOLLOW USER ===
//     describe("followUser", () => {
//         it("should add following and follower", async () => {
//             const user = { _id: "1", followings: [], save: jest.fn() };
//             const target = { _id: "2", followers: [], save: jest.fn() };

//             UserModel.findById
//                 .mockResolvedValueOnce(user)
//                 .mockResolvedValueOnce(target);

//             const result = await followUser("1", "2");
//             expect(user.followings).toContain("2");
//             expect(target.followers).toContain("1");
//             expect(result).toEqual({ message: "User followed successfully" });
//         });

//         it("should throw if trying to follow self", async () => {
//             await expect(followUser("1", "1")).rejects.toThrow("You cannot follow yourself");
//         });

//         it("should throw if target user not found", async () => {
//             UserModel.findById
//                 .mockResolvedValueOnce({ _id: "1", followings: [], save: jest.fn() })
//                 .mockResolvedValueOnce(null);
//             await expect(followUser("1", "404")).rejects.toThrow("Target user not found");
//         });
//     });

//     // === UNFOLLOW USER ===
//     describe("unfollowUser", () => {
//         it("should remove following and follower", async () => {
//             const user = { _id: "1", followings: ["2"], save: jest.fn() };
//             const target = { _id: "2", followers: ["1"], save: jest.fn() };

//             UserModel.findById
//                 .mockResolvedValueOnce(user)
//                 .mockResolvedValueOnce(target);

//             const result = await unfollowUser("1", "2");
//             expect(user.followings).not.toContain("2");
//             expect(target.followers).not.toContain("1");
//             expect(result).toEqual({ message: "User unfollowed successfully" });
//         });

//         it("should throw if trying to unfollow self", async () => {
//             await expect(unfollowUser("1", "1")).rejects.toThrow("You cannot unfollow yourself");
//         });

//         it("should throw if target user not found", async () => {
//             UserModel.findById
//                 .mockResolvedValueOnce({ _id: "1", followings: [], save: jest.fn() })
//                 .mockResolvedValueOnce(null);
//             await expect(unfollowUser("1", "404")).rejects.toThrow("Target user not found");
//         });
//     });
// });


// __tests__/userAuthService.test.js
process.env.JWT_SECRET = "flightsocial";

// __tests__/userAuthService.test.js
import { registerUser, loginUser } from "@server/services/authService.js";
import {
    getUserProfile,
    updateUser,
    getUserFriends,
    followUser,
    unfollowUser
} from "@server/services/userService.js";
import UserModel from "@server/models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ⚡️ הגדרת JWT_SECRET לבדיקה
process.env.JWT_SECRET = "testSecret";

jest.mock("@server/models/User.js");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

// עזרה למנוע חזרות מיותרות
const mockFindByIdSequence = (results) => {
    results.forEach((res) => {
        UserModel.findById.mockResolvedValueOnce(res);
    });
};

describe("Auth & User Services", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // === AUTH TESTS ===
    describe("register", () => {
        it("should create and save a new user", async () => {
            bcrypt.hash.mockResolvedValue("hashedPass");

            UserModel.prototype.save = jest.fn().mockImplementation(function () {
                return this; // מחזיר את המשתמש עצמו אחרי שמירה
            });

            const user = { username: "stav", email: "s@test.com", password: "123456" };
            const result = await registerUser(user);

            expect(UserModel.prototype.save).toHaveBeenCalled();
            expect(result).toHaveProperty("username", "stav");
        });
    });

    describe("login", () => {
        it("should return token when credentials are valid", async () => {
            const user = {
                _id: "1",
                username: "stav",
                isAdmin: false,
                comparePassword: jest.fn().mockResolvedValue(true)
            };
            UserModel.findOne.mockResolvedValue(user);
            jwt.sign.mockReturnValue("token123");

            const result = await loginUser({ email: "s@test.com", password: "123456" });

            expect(user.comparePassword).toHaveBeenCalledWith("123456");
            expect(result).toEqual({ user, token: "token123" });
        });

        it("should throw error if user not found", async () => {
            UserModel.findOne.mockResolvedValue(null);
            await expect(loginUser({ email: "no@test.com", password: "123" }))
                .rejects.toThrow("User not found");
        });

        it("should throw error if password is invalid", async () => {
            const user = { _id: "1", comparePassword: jest.fn().mockResolvedValue(false) };
            UserModel.findOne.mockResolvedValue(user);

            await expect(loginUser({ email: "s@test.com", password: "wrong" }))
                .rejects.toThrow("Invalid password, please try again");
        });
    });

    // === USER TESTS ===
    describe("getUserProfile", () => {
        it("should return user if found", async () => {
            const mockUser = { _id: "1", username: "stav" };
            UserModel.findOne.mockResolvedValue(mockUser);

            const result = await getUserProfile({ username: "stav" });
            expect(result).toEqual(mockUser);
        });

        it("should throw error if user not found", async () => {
            UserModel.findOne.mockResolvedValue(null);
            await expect(getUserProfile({ username: "404" }))
                .rejects.toThrow("User not found");
        });
    });

    describe("updateUser", () => {
        it("should update and return user", async () => {
            const mockUser = { _id: "1", username: "stav" };
            UserModel.findByIdAndUpdate.mockResolvedValue(mockUser);

            const result = await updateUser("1", { username: "stav" });
            expect(result).toEqual(mockUser);
        });

        it("should throw if user not found", async () => {
            UserModel.findByIdAndUpdate.mockResolvedValue(null);
            await expect(updateUser("404", { username: "x" }))
                .rejects.toThrow("User not found");
        });
    });

    describe("getUserFriends", () => {
        it("should return friends list", async () => {
            const mockUser = { _id: "1", followings: ["2", "3"] };
            const friend1 = { _id: "2", username: "A", profilePicture: "picA" };
            const friend2 = { _id: "3", username: "B", profilePicture: "picB" };

            UserModel.findById.mockResolvedValueOnce(mockUser);
            mockFindByIdSequence([friend1, friend2]);

            const result = await getUserFriends("1");
            expect(result).toEqual([
                { _id: "2", username: "A", profilePicture: "picA" },
                { _id: "3", username: "B", profilePicture: "picB" }
            ]);
        });

        it("should throw if user not found", async () => {
            UserModel.findById.mockResolvedValue(null);
            await expect(getUserFriends("404"))
                .rejects.toThrow("User not found");
        });
    });

    describe("followUser", () => {
        it("should add following and follower", async () => {
            const user = { _id: "1", followings: [], updateOne: jest.fn() };
            const currentUser = { _id: "2", followers: [], updateOne: jest.fn() };

            UserModel.findById
                .mockResolvedValueOnce(user)
                .mockResolvedValueOnce(currentUser);

            const result = await followUser({ id: "1" }, { id: "2" });

            expect(user.updateOne).toHaveBeenCalled();
            expect(currentUser.updateOne).toHaveBeenCalled();
            expect(result).toEqual({ user, currentUser });
        });

        it("should throw if target user not found", async () => {
            const user = { _id: "1", followings: [], updateOne: jest.fn() };
            UserModel.findById
                .mockResolvedValueOnce(user)
                .mockResolvedValueOnce(null);

            await expect(followUser({ id: "1" }, { id: "404" }))
                .rejects.toThrow("Target user not found");
        });
    });

    describe("unfollowUser", () => {
        it("should remove following and follower", async () => {
            const user = { _id: "1", followings: ["2"], updateOne: jest.fn() };
            const currentUser = { _id: "2", followers: ["1"], updateOne: jest.fn() };

            UserModel.findById
                .mockResolvedValueOnce(user)
                .mockResolvedValueOnce(currentUser);

            const result = await unfollowUser({ id: "1" }, { id: "2" });

            expect(user.updateOne).toHaveBeenCalled();
            expect(currentUser.updateOne).toHaveBeenCalled();
            expect(result).toEqual({ user, currentUser });
        });

        it("should throw if target user not found", async () => {
            const user = { _id: "1", followings: [], updateOne: jest.fn() };
            UserModel.findById
                .mockResolvedValueOnce(user)
                .mockResolvedValueOnce(null);

            await expect(unfollowUser({ id: "1" }, { id: "404" }))
                .rejects.toThrow("Target user not found");
        });
    });
});
