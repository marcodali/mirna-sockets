export default function healthCheck(req, res, next){
    try {
        res.status(204).send()
    } catch (err) {
        next(err)
    }
}
