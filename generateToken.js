const jsonwebtoken = require('jsonwebtoken');

module.exports = (id) => {
  return jsonwebtoken.sign({ id }, process.env.JWT_KEY, {
    expiresIn: "30d"
  }); 
}