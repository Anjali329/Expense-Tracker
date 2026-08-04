const { spawnSync } = require("child_process");
const path = require("path");

function predictCategory(description) {

    try {

        const pythonResult = spawnSync(

            "python",

            [

                path.join(__dirname, "../../ml/scripts/predict.py"),

                description

            ],

            {

                encoding: "utf-8"

            }

        );

        if (pythonResult.error) {

            console.error(pythonResult.error);

            return {

                category: "Unknown",

                confidence: 0

            };

        }

        const prediction = JSON.parse(

            pythonResult.stdout.trim()

        );

        return {

            category: prediction.category,

            confidence: prediction.confidence

        };

    }

    catch (err) {

        console.error(err);

        return {

            category: "Unknown",

            confidence: 0

        };

    }

}

module.exports = predictCategory;