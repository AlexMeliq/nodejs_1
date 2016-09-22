
/**
 * Created by Administrator on 9/22/2016.
 */

var mongoose = require('mongoose')
    , Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var userSchema   = new Schema({
    _id: ObjectId,
    name: String,
    avatar: String
});

module.exports = mongoose.model('User', userSchema);
