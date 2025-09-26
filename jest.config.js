export default {
    testEnvironment: "node",
    moduleNameMapper: {
        "^@server/(.*)$": "<rootDir>/server/$1"
    },
    transform: {
        "^.+\\.js$": "babel-jest"
    }
};
