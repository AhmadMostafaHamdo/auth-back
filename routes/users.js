const express = require("express");
const {
  getAllUsers,
  getUserById,
  deleteUser,
  updateUser,
} = require("../controller/usersContoller");
const {
  verifyToken,
  verfiyIsAdminAndAuthorize,
} = require("../middleware/verfiyToken");
const router = express.Router();
router.use(verifyToken);
/*
    @desc Get All Users
    @route /users
    @method GET
    @access public
*/
router.route("/").get(getAllUsers);
/*
    @desc Get User By Id
    @route /users/:id
    @method GET
    @access public
*/
router.get("/:id", getUserById);
/*
    @desc Update User
    @route /users
    @method PUT
    @access private
*/
router.put("/:id", updateUser);
/*
    @desc Delete User
    @route /users/:id
    @method DELETE
    @access Private
*/
router.delete("/:id", verfiyIsAdminAndAuthorize, deleteUser);
module.exports = router;
