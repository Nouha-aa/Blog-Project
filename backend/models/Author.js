import mongoose from "mongoose";
import bcrypt from "bcrypt";

const authorSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  cognome: { type: String, required: true },
  email: { type: String, required: true},
  dataDiNascita: { type: String },
  avatar: { type: String },
  password: { type: String },
  googleId: { type: String },
}, {
  timestamps: true,
  collection: "authors"
});

// metodo per confrontare password
authorSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// middleware per l'hashting delle password prima che vengano salvate nel database
authorSchema.pre("save", async function (next) {
  // esegue l'hash solo se la password non è stata modificata (o è nuova)
  if (!this.isModified("password")) return next();


try {
  // gli hash sono le password criptate dall'algoritmo bcrypt
  // genera un salt e hash la password // i salt sono random stringhe di 10 caratteri
  const salt = await bcrypt.genSalt(10); // 10 = numero di salt da generare
  this.password = await bcrypt.hash(this.password, salt);
  next();
  } catch (error) {
  next(error);
  }
});

export default mongoose.model("Author", authorSchema);
