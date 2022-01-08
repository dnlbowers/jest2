/**
 * @jest-environment jsdom
 */
const {game, newGame, showScore, addTurn, lightsOn, showTurns, playerTurn} = require("../game");

jest.spyOn(window, "alert").mockImplementation(() => { });

beforeAll(() => {
    let fs = require("fs");
    let fileContents = fs.readFileSync("index.html", "utf-8");
    document.open();
    document.write(fileContents);
    document.close();
})

describe("game object contains the correct keys", () => {
    
    test("score key exists", () => {
        expect("score" in game).toBe(true);
    });

    test("currentGame key exists", () => {
        expect("currentGame" in game).toBe(true);
    });

    test("playerMoves key exists", () => {
        expect("playerMoves" in game).toBe(true);
    });

    test("choices key exists", () => {
        expect("choices" in game).toBe(true);
    });

    test("turnNumber key exist", () => {
        expect("turnNumber" in game).toBe(true);
    })

    test("choices contains correct button IDs", () => {
        expect(game.choices).toEqual(["button1", "button2", "button3", "button4"]);
    })
});

describe("newGame works correctly", () => {
    beforeAll(() => {
        game.score = 42;
        game.playerMoves = ["button1", "button2"]
        game.currentGame = ["button1", "button2"]
        document.getElementById("score").innerText = "42";
        game.turnNumber = 42;
        newGame();
    });
    
    test("should set game score to zero", () => {
        expect(game.score).toEqual(0);
    });

    test("should clear the history of the playerMoves array", () => {
        expect(game.playerMoves.length).toBe(0);
    });
    // toString.Equal or toBe both work on these two
    // test("should clear the history of the currentGame array", () => {
    //     expect(game.currentGame.length).toEqual(0);
    // });

    test("should add one move to the computer's game array", () => {
        expect(game.currentGame.length).toBe(1);
    });

    test("should display zero for the element with the ID of score", () => {
        expect(document.getElementById("score").innerText).toEqual(0);
    });

    test("resets turnNumber to zero", () => {
        expect(game.turnNumber).toBe(0);
    })

    test("expect data-listener to be true", () => {
        const elements = document.getElementsByClassName("circle");
        for (let element of elements) {
            expect(element.getAttribute("data-listener")).toEqual("true");
        }
    })

});

describe("game play works correct", () => {
    beforeEach (() => {
        game.score = 0;
        game.currentGame = [];
        game.playerMoves =[];
        addTurn();
    });

    afterEach(() => {
        game.score = 0;
        game.currentGame = [];
        game.playerMoves =[]; 
    });

    test("addTurn adds a new turn to the game", () => {
        addTurn();
        expect(game.currentGame.length).toBe(2);
    });

    test("should add correct class to light up the buttons", () => {
        let button = document.getElementById(game.currentGame[0]);
        lightsOn(game.currentGame[0]);
        expect(button.classList).toContain("light");
    })

    test("showTurns should update game.turnNumber", () => {
        game.turnNumber = 42;
        showTurns();
        expect(game.turnNumber).toBe(0);
    })

    test("should increment the score if the turn is correct", () => {
        game.playerMoves.push(game.currentGame[0]);
        playerTurn();
        expect(game.score).toBe(1);
    })

    test("should call an alert if wrong move made", () => {
        game.playerMoves.push("wrong");
        playerTurn();
        expect(window.alert).toBeCalledWith("Wrong Move!");
    });

    test("gameInProgress shows as true during computer turn", () => {
        showTurns();
        expect(game.turnInProgress).toEqual(true);
    })

    test("clicking during the computer sequence should fail", () => {
        showTurns();
        game.lastButton = "";
        document.getElementById("button2").click();
        expect(game.lastButton).toEqual("");
    });
}); 