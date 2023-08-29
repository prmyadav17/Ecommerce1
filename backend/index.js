const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const categoriesRouters = require("./routes/CategoriesRoutes");
const brandsRouters = require("./routes/BrandsRoutes");
const usersRouter = require("./routes/UserRoutes");
const authRouter = require("./routes/AuthRoutes");
const cartRouter = require("./routes/CartRoutes");
const cookieParser = require("cookie-parser");
const ordersRouter = require("./routes/OrderRoutes");
const session = require("express-session");
const passport = require("passport");
const jwt = require("jsonwebtoken");
// const SQLiteStore = require("connect-sqlite3")(session);
const LocalStrategy = require("passport-local").Strategy;
const crypto = require("crypto");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const path = require("path");

const productsRouters = require("./routes/ProductsRoutes");
const { User } = require("./model/UserModal");
const { isAuth, sanitizeUser, cookieExtractor } = require("./services/common");
const { Order } = require("./model/OrderModal");
const server = express();
dotenv.config();
connectDB();
const port = process.env.PORT || 5000;
// console.log(process.env);

// const endpointSecret = process.env.ENDPOINT_SECRET;
const endpointSecret = process.env.PUBLIC_KEY;
// server.use(express.raw({ type: "application/json" }));
server.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object;

        const order = await Order.findById(
          paymentIntentSucceeded.metadata.orderId
        );
        order.paymentStatus = "received";
        await order.save();

        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);

//JWT options
const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.JWT_SECRET_KEY;

//Middlewares
server.use(cookieParser());
server.use(express.static(path.resolve(__dirname, "build")));
server.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    // store: new SQLiteStore({ db: "sessions.db", dir: "./var/db" }),
  })
);
server.use(passport.authenticate("session"));

server.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
  })
);
server.use(express.json());

// server.get("/", (req, res) => {
//   res.json({ status: "success" });
// });

server.use("/myproducts", isAuth(), productsRouters.router);
server.use("/mycategories", isAuth(), categoriesRouters.router);
server.use("/mybrands", isAuth(), brandsRouters.router);
server.use("/myusers", isAuth(), usersRouter.router);
server.use("/myauth", authRouter.router);
server.use("/mycart", isAuth(), cartRouter.router);
server.use("/myorders", isAuth(), ordersRouter.router);

//Passport Strategies

passport.use(
  "local",
  new LocalStrategy({ usernameField: "email" }, async function (
    email,
    password,
    done
  ) {
    try {
      const user = await User.findOne({ email: email });
      console.log(email, password, user);
      if (!user) {
        // res.status(401).json({ message: "no such user email" });
        done(null, false, { message: "Invalid credentials" });
      }
      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        "sha256",
        async function (err, hashedPassword) {
          if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
            return done(null, false, { message: "Invalid credentials" });
          }
          const token = jwt.sign(
            sanitizeUser(user),
            process.env.JWT_SECRET_KEY
          );
          done(null, { id: user.id, role: user.role, token }); // this lines sends to serializer
        }
      );
    } catch (error) {
      done(error);
    }
  })
);

passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      const user = await User.findById(jwt_payload.id);
      if (user) {
        return done(null, sanitizeUser(user));
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

passport.serializeUser(function (user, cb) {
  // console.log("serialize", user);
  process.nextTick(function () {
    return cb(null, { id: user.id, role: user.role });
  });
});

passport.deserializeUser(function (user, cb) {
  // console.log("de-serialize", user);

  process.nextTick(function () {
    return cb(null, user);
  });
});

// ---******************---------- Payment-------*************
const stripe = require("stripe")(process.env.SECRET_KEY);

// const calculateOrderAmount = (items) => {
//   return 1400;
// };

server.post("/create-payment-intent", async (req, res) => {
  const { totalAmount } = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount * 100,
    currency: "inr",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
