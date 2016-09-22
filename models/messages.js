
/**
 * Created by Administrator on 9/22/2016.
 */
var mongoose = require('mongoose')
    ,Schema = mongoose.Schema
    ,ObjectId = Schema.ObjectId;

var messageSchema = new Schema({
    _id: ObjectId,
    content: String,
    user_id: ObjectId
});

module.exports = mongoose.model('Message', messageSchema, 'messages');