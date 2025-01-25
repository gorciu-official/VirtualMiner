var money = 0;

var minedStone = 0;
var minedIron = 0;
var minedCopper = 0;
var minedGold = 0;
var minedDiamonds = 0;

var stonePrice = 1;
var ironPrice = 15;
var copperPrice = 50;
var goldPrice = 50;
var diamondsPrice = 100;

var goldenOres = 0;
var betterOres = 0;

var clickers1 = 0;
var clickers2 = 0;

var mining = false;

var pickaxe = {
    canMineIron: false,
    canMineCopper: false,
    canMineGold: false,
    canMineDiamonds: false,
    speedInSeconds: 3.2,
    durability: 1000,
    maxDurability: 1000
};

var temp1 = true;

function goldenOresHandler() {
    goldenOres++;
    updateData();
}

function updateData() {
    if (pickaxe.durability == null) {
        pickaxe.durability = Infinity;
    }
    if (pickaxe.maxDurability == null) {
        pickaxe.maxDurability = Infinity;
    }

    var statsString = "<b>Stone:</b> " + minedStone + "<br>";
    if (pickaxe.canMineIron) {
        statsString += "<b>Iron:</b> " + minedIron + "<br>";
    }
    if (pickaxe.canMineCopper) {
        statsString += "<b>Copper:</b> " + minedCopper + "<br>";
    }
    if (pickaxe.canMineGold) {
        statsString += "<b>Gold:</b> " + minedGold + "<br>";
    }
    if (pickaxe.canMineDiamonds) {
        statsString += "<b>Diamonds:</b> " + minedDiamonds + "<br>";
    }
    if (pickaxe.canMineIron && pickaxe.canMineCopper && pickaxe.canMineDiamonds) {
        statsString += "<u>All ores unlocked!</u><br>";
    } else {
        statsString += "<b>Next ore:</b> ";
        if (!pickaxe.canMineIron) {
            statsString += "Iron";
        } else if (!pickaxe.canMineCopper) {
            statsString += "Copper";
        } else if (!pickaxe.canMineGold) {
            statsString += "Gold";
        } else if (!pickaxe.canMineDiamonds) {
            statsString += "Diamonds";
        }
        statsString += " (buy on right panel) <br>";
    }
    statsString += "<b>Golden Ores:</b> " + goldenOres + "<br>";
    statsString += "<b>Pickaxe Durability:</b> " + pickaxe.durability.toFixed() + "/" + pickaxe.maxDurability.toFixed() + "<br>";
    statsString += "<b>Pickaxe Speed:</b> " + pickaxe.speedInSeconds.toFixed(2) + "s (to mine one ore)";
    document.querySelector(".stats").innerHTML = statsString;

    var counterString = "Money: " + money.toFixed(2) + " PLN";
    document.querySelector("#counter").innerHTML = counterString;

    if (mining) {
        document.querySelector("#status").innerHTML = "Mining...";
    } else {
        document.querySelector("#status").innerHTML = "<span style=\"color:lime;\">Ready!</style>";
    }

    if (pickaxe.durability < 100 && temp1) {
        alert("Emergency situation! Your pickaxe is about to break! Don't worry! Buy a new item, now available - the more maximum durability in the shop (this will completelly renew the pickaxe, but you will be still able to mine existing ores)!");
        document.querySelector(`div[data-item="more-durability"]`).classList.remove("hidden");
        alert("Pro-tip! You can now buy infinity durability of your pickaxe! Also unlocked in the shop, just scroll.");
        document.querySelector(`div[data-item="infinity-durability"]`).classList.remove("hidden");
        temp1 = false;
    }
}

function sell() {
    var newMoney = 0;
    newMoney += minedStone * stonePrice;
    newMoney += minedIron * ironPrice;
    newMoney += minedCopper * copperPrice;
    newMoney += minedDiamonds * diamondsPrice;
    newMoney += minedGold * goldPrice;

    if (Math.random() < 1/10) {
        newMoney += newMoney * 0.10;
    }

    money += newMoney;

    minedStone = 0;
    minedIron = 0;
    minedCopper = 0;
    minedGold = 0;
    minedDiamonds = 0;

    updateData();
}

function mine(skipMiningCheck = false) {
    const oreAnimation = document.createElement("span");
    oreAnimation.innerText = "+1";
    oreAnimation.style.position = "absolute";
    oreAnimation.style.top = Math.random() * 100 + "%";
    oreAnimation.style.left = Math.random() * 100 + "%";
    oreAnimation.style.rotate = "-45deg";
    oreAnimation.style.opacity = "0.7";
    oreAnimation.style.backgroundColor = "var(--accent)";
    oreAnimation.style.borderRadius = "50%";
    oreAnimation.style.padding = "5px";
    document.querySelector('.ore').appendChild(oreAnimation);

    setTimeout(() => {
        oreAnimation.style.opacity = "1";
        setTimeout(() => {
            oreAnimation.remove();
        }, 400);
    }, 600);

    if (pickaxe.durability <= 0) {
        document.querySelector("#status").innerHTML = "Pickaxe is broken! Buy a new one in the right panel.";
        return;
    }

    if (mining && !skipMiningCheck) return;
    if (!skipMiningCheck) mining = true;

    updateData();

    setTimeout(() => {
        for (let i = 0; i <= betterOres; i++) {
            var oreType = Math.random();
            if (oreType < 0.7) {
                minedStone++;
                pickaxe.durability -= 1;
            } else if (oreType < 0.9 && pickaxe.canMineIron) {
                minedIron++;
                pickaxe.durability -= 2;
            } else if (oreType < 0.97 && pickaxe.canMineGold) {
                minedGold++;
                pickaxe.durability -= 3;
            } else if (oreType < 0.98 && pickaxe.canMineCopper) {
                minedCopper++;
                pickaxe.durability -= 5;
            } else if (pickaxe.canMineDiamonds) {
                minedDiamonds++;
                pickaxe.durability -= 7;
            } else {
                minedStone++;
                pickaxe.durability -= 1;
            }

            if (pickaxe.durability <= 0) {
                document.querySelector("#status").innerHTML = "Pickaxe is broken! Buy a new one in the right panel.";
                pickaxe.durability = 0;
                return;
            }
        }

        document.querySelector("#status").innerHTML = "Ready!";
        if (!skipMiningCheck) mining = false;
        updateData();
    }, skipMiningCheck ? 50 : pickaxe.speedInSeconds * 1000);
}

function buy(item) {
    var cost = parseInt(document.querySelector(`div[data-item="${item}"] .cost`).innerHTML.replaceAll(" ", ""));
    if (money < cost) {
        alert("Not enough money!");
        return;
    }

    money -= cost;

    if (item === "buy-mini-cursor") {
        clickers1++;
        setInterval(() => {
            money += 0.1;
            updateData();
        }, 1000);
        alert("You bought your auto-clicker! Remember, mining manually has one advantage - you can mine golden ores, which will be useful in the future.");
    } else if (item === "buy-cursor") {
        clickers2++;
        setInterval(() => {
            mine(true);
            updateData();
        }, 1000);
        alert("You bought your auto-clicker! Remember, mining manually has one advantage - you can mine golden ores, which will be useful in the future.");
    } else if (item === "upgrade-pickaxe") {
        if (pickaxe.canMineCopper) {
            document.querySelector(`div[data-item="${item}"] h2`).innerHTML = "Upgrade to Diamond (<span class='cost'>5 000 000</span> PLN)";
        } else if (pickaxe.canMineGold) {
            pickaxe.canMineDiamonds = true;
            document.querySelector(`div[data-item="${item}"]`).remove();
            document.querySelector('.tradecenter').classList.remove('hidden');
            alert("Trading center unlocked! You can now exchange your ores for other ores. Remember, some deals are better than others!");
            document.body.style.backgroundColor = "var(--background-stage2)";
            alert("New stage unlocked! You are in stage 2 now. You can now get golden ores.");
            setInterval(goldenOresHandler, 120 * 1000);
        } else if (pickaxe.canMineIron) {
            pickaxe.canMineCopper = true;
            document.querySelector(`div[data-item="${item}"] h2`).innerHTML = "Upgrade to Gold (<span class='cost'>5 000 000</span> PLN)";
        } else {
            pickaxe.canMineIron = true;
            document.querySelector(`div[data-item="${item}"] h2`).innerHTML = "Upgrade to Copper (<span class='cost'>250 000</span> PLN)";
        }
    } else if (item === "upgrade-pickaxe-speed") {
        if (pickaxe.speedInSeconds <= 0.2) {
            // last upgrade
            document.querySelector(`div[data-item="${item}"]`).remove();
        }

        pickaxe.speedInSeconds -= 0.05;
    } else if (item === "renew-pickaxe") {
        var newDurability = pickaxe.maxDurability / 10;
        if (pickaxe.durability + newDurability > pickaxe.maxDurability) {
            pickaxe.durability = pickaxe.maxDurability;
        } else {
            pickaxe.durability += newDurability;
        }
    } else if (item === "buy-better-ore") {
        betterOres++;
    } else if (item === "more-durability") {
        pickaxe.maxDurability += pickaxe.maxDurability / 5;
        pickaxe.durability = pickaxe.maxDurability;
    } else if (item === "infinity-durability") {
        pickaxe.maxDurability += Infinity;
        pickaxe.durability = Infinity;
        document.querySelector(`div[data-item="${item}"]`).remove();
        document.querySelector(`div[data-item="more-durability"]`).remove();
    }

    document.querySelector(`div[data-item="${item}"] .cost`).innerHTML = cost * 2;
    updateData();
}

document.querySelectorAll(".item").forEach(item => {
    item.addEventListener("click", () => {
        buy(item.dataset.item);
    });
});

function generateOffers() {
    for (let ii = 1; ii < 4; ii++) {
        const offersContainer = document.querySelector(`#offers${ii}`);
        offersContainer.innerHTML = "";

        for (let i = 0; i < 3; i++) {
            const offer = document.createElement("div");
            offer.className = "offer";

            const giveType = ["Stone", "Iron", "Copper", "Gold", "Diamonds"][Math.floor(Math.random() * 5)];
            const giveAmount = Math.floor(Math.random() * 50) + 1;
            const takeType = ["Stone", "Iron", "Copper", "Gold", "Diamonds"][Math.floor(Math.random() * 5)];
            const takeAmount = Math.floor(Math.random() * 50) + 1;

            offer.innerHTML = `
                <p><b>I'm someone and I want to offer you this exchange:</b></p>
                <br>
                <p>You give me: ${giveAmount} ${giveType}</p>
                <p>You take from me: ${takeAmount} ${takeType}</p>
                <button onclick="acceptOffer('${giveType}', ${giveAmount}, '${takeType}', ${takeAmount})">Accept</button>
            `;

            offersContainer.appendChild(offer);
        }
    }
}

function acceptOffer(giveType, giveAmount, takeType, takeAmount) {
    if (eval(`mined${giveType}`) < giveAmount) {
        alert("Not enough resources to accept this offer.");
        return;
    }

    eval(`mined${giveType} -= giveAmount`);
    eval(`mined${takeType} += takeAmount`);
    updateData();
    generateOffers();
}

function saveGame() {
    window.localStorage.setItem("vm_savedata", JSON.stringify({
        money: money,
        minedStone: minedStone,
        minedIron: minedIron,
        minedCopper: minedCopper,
        minedDiamonds: minedDiamonds,
        goldenOres: goldenOres,
        betterOres: betterOres,
        pickaxe: pickaxe,
        clickers1: clickers1,
        clickers2: clickers2
    }));
}

function introducting() {
    alert("Welcome to Virtual Miner! Your goal is to mine as many ores as possible and exchange them for other ores. Remember, you can also buy some upgrades in the shop. Have fun!");
}

function loadGame() {
    document.addEventListener("mouseover", saveGame);
    setInterval(saveGame, 20 * 1000);

    var json = JSON.parse(window.localStorage.getItem("vm_savedata"));
    if (!json) return introducting();

    money = json.money;
    minedStone = json.minedStone;
    minedIron = json.minedIron;
    minedCopper = json.minedCopper;
    minedDiamonds = json.minedDiamonds;
    goldenOres = json.goldenOres;
    betterOres = json.betterOres;
    pickaxe = json.pickaxe;
    clickers1 = json.clickers1;
    clickers2 = json.clickers2;

    if (pickaxe.durability == null) {
        pickaxe.durability = Infinity;
    }
    
    if (pickaxe.canMineDiamonds) {
        document.body.style.backgroundColor = "var(--background-stage2)";
        document.querySelector('.tradecenter').classList.remove('hidden');
        setInterval(goldenOresHandler, 120 * 1000);
    }

    for (let i = 0; i < clickers1; i++) {
        setInterval(() => {
            money += 0.1;
            updateData();
        }, 1000);
    }

    for (let i = 0; i < clickers2; i++) {
        setInterval(() => {
            mine(true);
            updateData();
        }, 1000);
    }

    document.querySelectorAll(".item").forEach(item => {
        if (item.dataset.item === "upgrade-pickaxe") {
            if (pickaxe.canMineDiamonds) {
                document.querySelector(`div[data-item="upgrade-pickaxe"]`).remove();
            } else if (pickaxe.canMineCopper) {
                document.querySelector(`div[data-item="upgrade-pickaxe"] h2`).innerHTML = "Upgrade to Diamond - <span class='cost'>5 000 000</span> PLN";
            } else if (pickaxe.canMineIron) {
                document.querySelector(`div[data-item="upgrade-pickaxe"] h2`).innerHTML = "Upgrade to Copper - <span class='cost'>250 000</span> PLN";
            }
        }

        if (item.dataset.item === "upgrade-pickaxe-speed") {
            if (pickaxe.speedInSeconds <= 0.2) {
                item.remove();
            }
        }

        if (item.dataset.item === "infinity-durability") {
            if (pickaxe.maxDurability == Infinity) {
                item.remove();
                document.querySelector(`div[data-item="more-durability"]`).remove();
            }
        }
    });
}

setInterval(generateOffers, 60 * 1000);

loadGame();

updateData();
generateOffers();