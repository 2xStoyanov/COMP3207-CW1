export default {
    MAX_ATTACHMENT_SIZE: 5000000,
  s3: {
    REGION: "eu-west-2",
    BUCKET: "cw1-bucket"
  },
  apiGateway: {
    REGION: "eu-west-2",
    URL: "https://7vti8kilni.execute-api.eu-west-2.amazonaws.com/prod"
  },
  cognito: {
    REGION: "eu-west-2",
    USER_POOL_ID: "eu-west-2_hl08mHRQj",
    APP_CLIENT_ID: "4s67qre4ibrll3spovcjl3d2ov",
    IDENTITY_POOL_ID: "eu-west-2:3da3706e-7220-4a10-90eb-c8bc1d4330c6"
  }
};