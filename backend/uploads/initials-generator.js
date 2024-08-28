const {createCanvas,loadImage} = require('canvas')
const fs = require('fs')
function generateInitialsAvatar(initials){
    const canvasSize = 200
    const fontSize = 80
    const backgroundColor = ['#b66b33','#5bdc5b','#4848ef'][Math.round(Math.random()*10)%3]
    let textColor = '#ffffff'
    const canvas = createCanvas(canvasSize,canvasSize)
    const context = canvas.getContext('2d')
    context.fillStyle = backgroundColor
    context.fillRect(0,0,canvasSize,canvasSize)
    context.fillStyle = textColor
    context.font = `bold ${fontSize}px Arial`
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillText(initials,canvasSize/2,canvasSize/2)
    return canvas.toBuffer('image/png')
}
module.exports = generateInitialsAvatar