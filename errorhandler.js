async function getProfile(req, res, next) {
    try {
       const profile = await studentProfile.findOne({
        userId: req.user.id
       }) 
       res.status(200).json({profile})
    } catch (error) {
        next(error)
    }
    
}