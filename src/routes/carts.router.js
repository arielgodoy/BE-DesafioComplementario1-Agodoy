const {Router} = require('express')
const { cartModel } = require('../dao/models/carts.model.js')

const router = Router()

router
    .get('/:cid', async (req,res)=>{
        const {cid} = req.params
        const cart = await cartModel.findOne({_id: cid }) 

        res.send({
            status: 'success',
            payload: cart        
        })
    })
    .post('/', async (req,res)=>{
        const newCart = req.body

        const result = await cartModel.create(newCart)

        
        res.send({
            status: 'success',
            payload: result
        })
    })

module.exports = router