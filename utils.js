module.exports = {
  sendJSON: function(payload, res){
    res.setHeader('Content-Type', 'text/json');
    res.end(JSON.stringify(payload));
  }
}
