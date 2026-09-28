import { createConversationService, deleteConversationService, getConversationsService } from "../service/conversation.service.js"

export async function getConversationsController(req,res,next){
try { 
    const fakePayload={
        id:2,
        email:"user@gmail.com"
    }
    const userId=fakePayload.id
    const conversations=await getConversationsService(userId)
    res.status(200).json({
    success:true,
    conversations
    })
} catch (error) {
    next(error)
}
}
export async function createConversationController(req, res, next) {
  try {
    const { firstMessage } = req.body;
    const userId = 2; // Temporary test user ID
    const result = await createConversationService(
      userId,
      firstMessage.trim()
    );

    return res.status(201).json({
      success: true,
      conversation: result.conversation,
      userMessage: result.userMessage,
      assistantMessage: result.assistantMessage,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteConversationController(req,res,next){
try {
    const {id}=req.params
    const userId = 2; // temporary
    await deleteConversationService(userId,id)
    res.status(200).json({
        success:true,
        message:"conversation deleted successfully"

    })
} catch (error) {
    next(error)
}
}

