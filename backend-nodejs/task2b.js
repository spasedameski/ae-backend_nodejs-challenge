const express = require("express");

const app = express();
const port = process.env.PORT || 3000;
const uri =
  "mongodb+srv://test:qwertz1234@cluster0.gz0fwcy.mongodb.net/?retryWrites=true&w=majority";
// Middleware to parse JSON request bodies
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
// Connect to MongoDB database
MongoClient.connect(uri, {
  useNewUrlParser: true,
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})
  .then((client) => {
    console.log("Connected to database");

    // Get a reference to the emissions collection
    const db = client.db();
    const emissionsCollection = db.collection("emissions");

    // Add a new emissions document to the collection
    app.post("/emissions", async (req, res) => {
      try {
        const emissions = Array.isArray(req.body) ? req.body : [req.body];
        const result = await emissionsCollection.insertMany(emissions);
        res.json({ message: `${result.insertedCount} emissions added` });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // Query emissions data
    app.get("/emissions", async (req, res) => {
      try {
        const start_date = req.query.start_date;
        const end_date = req.query.end_date;

        const pipeline = [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $gte: [
                      { $toDate: "$time.interval_start" },
                      new Date(start_date),
                    ],
                  },
                  {
                    $lte: [
                      { $toDate: "$time.interval_start" },
                      new Date(end_date),
                    ],
                  },
                ],
              },
            },
          },
          {
            $group: {
              _id: null,
              average_value: { $avg: "$value.average" },
              max_value: { $max: "$value.max" },
              min_value: { $min: "$value.min" },
              count: { $sum: 1 },
            },
          },
          {
            $project: {
              _id: 0,
              average_value: 1,
              max_value: 1,
              min_value: 1,
              count: 1,
            },
          },
        ];

        const result = await db
          .collection("emissions")
          .aggregate(pipeline)
          .toArray();
        if (result.length > 0) {
          res.status(200).json(result[0]);
        } else {
          res
            .status(404)
            .json({ error: "No data found for the specified filter criteria" });
        }
      } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    app.get("/emissions/all", async (req, res) => {
      try {
        const result = await db.collection("emissions").find({}).toArray();
        if (result.length > 0) {
          res.json(result);
        } else {
          res.status(404).json({ error: "No data found in the collection" });
        }
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
      }
    });
    // Start the express server
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });

    // Gracefully close the database connection on termination
    process.on("SIGINT", () => {
      client.close();
      console.log("Database connection closed");
      process.exit(0);
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
