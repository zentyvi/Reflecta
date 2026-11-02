import { body } from "express-validator";
import orm from "../../prisma/db.ts";

const validateSignUp = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username cannot be blank")
    .isLength({ max: 30, min: 3 })
    .withMessage("Username must be between 3 and 30 characters")
    .not()
    .contains(" ")
    .withMessage("Usernmae cannot contain spaces")
    .matches(/^[a-zA-Z0-9]([a-zA-Z0-9_|-]{1,28}[a-zA-Z0-9])?$/)
    .withMessage("Invalid username")
    .custom(async (value: string) => {
      const user = await orm.users
        .where({ username: value.toLowerCase() })
        .first();

      if (user) {
        throw new Error("User already exists");
      }

      return true;
    }),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password cannot be blank")
    .matches(/^[A-Za-z0-9!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]+$/)
    .withMessage(
      "Password can contain only letters, numbers and symbols without spaces",
    )
    .isLength({ min: 6 })
    .withMessage("Password must contain at least 6 characters"),
  body("password-confirmation")
    .trim()
    .custom((value: string, { req }) => {
      if (!value === req.body["password"]) {
        throw new Error("Password don't match");
      }

      return true;
    }),
];

export default validateSignUp;
