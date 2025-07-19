import fs from "fs";
import readline from "readline";

// file name
const filePath = "numbers.csv";

// function to calculate nearest total
function findBestSubset(big, smallNumbers) {
  const n = smallNumbers.length;
  let bestSum = 0;
  let bestSubset = [];

  for (let mask = 0; mask < 1 << n; mask++) {
    let sum = 0;
    let subset = [];
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        sum += smallNumbers[i];
        subset.push(smallNumbers[i]);
      }
    }
    if (sum <= big && sum > bestSum) {
      bestSum = sum;
      bestSubset = subset;
    }
  }
  return { bestSubset, bestSum };
}

async function processCSV(filePath) {
  const rl = readline.createInterface({
    input: fs.createReadStream(filePath),
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    const nums = line.split(",").map(Number);
    const bigNumber = nums[0];
    const smallNumbers = nums.slice(1);

    const { bestSubset, bestSum } = findBestSubset(bigNumber, smallNumbers);

    console.log(`Row: ${line}`);
    console.log(
      `number combinations: [${bestSubset.join(", ")}], closet sum: ${bestSum}`
    );
    console.log("--------------------------------------------------");
  }
}

processCSV(filePath).catch(console.error);
