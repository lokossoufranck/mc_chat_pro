const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://user_cluster_1:uwQFgqq1rWZ1tMtm@cluster0.snwbn.mongodb.net/test?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connexion à MongoDB réussie !");
  })
  .catch(() => {
    console.log("Connexion à MongoDB échouée !");
  });

module.exports = {mongoose}