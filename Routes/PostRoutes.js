const express=require("express")
const blogController=require("../controller/postController")
const router=express.Router()
const protectRoute=require("../middleware/authMiddleware")
// router.route("/").get(blogController.getAllPost).post(blogController.createPost)

router.route("/").get(protectRoute,blogController.getAllPost).post(protectRoute,blogController.createPost)
router.route("/:id").patch(blogController.updateOnePost).delete(blogController.deletePost).get(blogController.getOnePost)
module.exports=router