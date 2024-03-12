import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
import background1 from './background.jpg';
import blueBird from './Blue_bird.png'
import redBird from './Red_Bird.png';
import YellowBird from './Yellow_bird.png';
import obstacles from './Obstacle2.png';
import gameNameimage from './flappy_bird.png';
import Musicfile1 from './Default.mp3';
import crashMusic from './Crash.mp3';
import './Btn.css';
import './RetroGaming.css';


// SOME CONSTANTS 
// wall parameters
const upperwall = 0;
const lowerwall = 940;
const leftwall = -100;
const rightwall = 948;
// Bird and Pipe parameters
const birdHeight = 78;
const birdwidth = 90;
const birdposition = 500;
const pipewidth = 100;

function Game({ jump, setjump, start, setstart, moveleft, setmoveleft }) {

    // Function to change the difficulty level
    const easy = 0.8;
    const medium = 0.9;
    const hard = 1;
    const [level, setLevel] = useState(easy);
    const handleDifficulty = (value) => {
        setLevel(value);
    }

    const [crashed, setCrashed] = useState(false)

    const transitionMovement = (val) => {
        let i = 0;
        while (i <= val) {
            setTimeout(() => {
                setjump(jump => jump - 1)
            }, 50);
            i += 1;
        }
    }

    // FUNCTION to control jump 
    const handlejump = () => {
        if (upperwall < jump) {
            setstart(true)
            // call transitioMovement to jump the bird
            if (!crashed) {
                transitionMovement(150)
            }
        }
        else {
            // collision condition
            setCrashed(true);
        }
    }

    // Function to add gravity
    useEffect(() => {
        let birdVal;
        if (!crashed && start && lowerwall > jump) {
            birdVal = setInterval(() => {
                setjump(jump => jump + level)
            }, 0);
        }
        else {
            // collisiion condition
            if (start)
                setCrashed(true);
        }
        return () => clearInterval(birdVal);
    })

    // Function to set random height
    const Randomheight = () => {
        const minHeight = 400;
        const maxHeight = 700;
        let newHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
        return newHeight
    }
    //Here height is generating randomly. useref will not allow the rerendering of the height unless the condition is satisfied
    const heightRef = useRef(Randomheight());


    // Function to add velocity to the pipes
    useEffect(() => {
        let velocity;

        if (crashed) return;

        if (start && moveleft >= leftwall) {
            velocity = setTimeout(() => {
                setmoveleft(prevMoveLeft => prevMoveLeft - 4);
            }, 5); // level is basically decide how fast will the object move
        } else {
            setmoveleft(rightwall);
            heightRef.current = Randomheight();
        }
        return () => clearTimeout(velocity);
    }, [start, moveleft, setmoveleft]);


    // // TO CHECK THE COLLISION OF THE BIRD
    let TopPipeHeight = (heightRef.current - 200);
    let bottomPipeHeight = (lowerwall - heightRef.current - 200);
    useEffect(() => {

        let upCollision = (jump <= TopPipeHeight);

        let downCollision = (jump <= lowerwall && jump >= lowerwall - bottomPipeHeight - birdHeight);

        let insidePipe = (moveleft <= birdposition + birdwidth && birdposition <= moveleft + pipewidth);

        if (!crashed && insidePipe && (upCollision || downCollision)) {
            setCrashed(true);
        }

    }, [jump, TopPipeHeight, bottomPipeHeight]);

    // This is For Restart Button
    useEffect(() => {
        if (!start) setjump(500)
    }, [start])

    const handleRestart = () => {
        setCrashed(false);
        setstart(false);
    }

    // SCORE UPDATE
    const [score, setscore] = useState(0);
    useEffect(() => {
        if (moveleft === birdposition) {
            // console.log("run");
            setscore(score + 1);
        } else {

            if (start) {
                setscore(score);
            }
            else {
                setscore(0);
            }
        }
    }, [moveleft]);

    // function to set high score
    const [highscore, setHighscore] = useState(localStorage.getItem("highscore") || 0);
    useEffect(() => {
        if (score >= highscore) {
            setHighscore(score);
        }
    }, [score]);
    // this useEffect will reduce the lag of highscore and will update the latest highscore
    useEffect(() => {
        storeHighScoreInLocalStorage(highscoreStorageKey, parseInt(highscore));
    }, [highscore])

    const highscoreStorageKey = "highscore";
    // Storing the highscore in localStorage
    function storeHighScoreInLocalStorage(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    // Function to select Bird
    const [selectbird, setselectbird] = useState(blueBird);
    const handleBird = (value) => {
        if (!start) {
            setselectbird(value);
        }
    }

    // Function to play and stop background music:
    // this useEffect will make sure that music plays in the background
    const [music, setmusic] = useState(null);
    useEffect(() => {
        const newAudio = new Audio(Musicfile1)
        setmusic(newAudio);
        newAudio.loop = true
    }, [])

    // when the game is playing the music will play and when the game is paused the music stops
    useEffect(() => {
        if (music)
            if (start)
                music.play()
            else {
                music.pause()
            }

    }, [music, start])

    // this useEffect will ensure to activate the crash sound when there is a collision but willnot activate when game is not started(i.e. start is false)
    // this is a clean up function
    useEffect(() => {
        return () => {
            if (start) {
                const newAudio = new Audio(crashMusic)
                newAudio.play()
            }
        }
    }, [start])

    return (
        <>
            <div className="home" style={{ position: 'relative', display: 'flex', overflow: 'hidden', justifyContent: 'center', alignItems: 'center' }}>

                {/* Name, Start and level */}
                <div className="buttons" style={{ position: 'absolute', top: 0, left: 0, height: '100vh', width: '25vw', zIndex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '25px' }}>

                    {/* Game Name */}
                    <div style={{ fontFamily: "Retro Gaming", textAlign: 'center', fontSize: '90px' }}>
                        <div style={{ color: 'gold', textShadow: '2px 2px 2px #fff', WebkitTextStroke: '3px black' }}>FLAPPY</div>
                        <div style={{ color: 'red', textShadow: '2px 2px 2px #fff', WebkitTextStroke: '3px black' }}>BIRD</div>
                    </div>

                    {/* START Button */}
                    <button className="game-button" onClick={handlejump} style={{ height: '100px', width: '100px' }}>{start ? "JUMP" : "START"}</button>

                    {/* CRASHED BUTTON */}
                    {<button className="game-button" onClick={handleRestart} style={{ height: '100px', width: '100px' }}>Restart</button>}

                    {/* select level */}
                    <div className='LEVEL' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 10 }}>

                        <div style={{ fontFamily: "Retro Gaming", fontSize: '40px', textAlign: 'center' }}><strong>LEVEL</strong></div>

                        <button className="game-button red" onClick={() => handleDifficulty(easy)} style={{ width: '200px' }}>EASY</button>

                        <button className="game-button green" onClick={() => handleDifficulty(medium)} style={{ width: '200px' }}>MEDIUM</button>

                        <button className="game-button" onClick={() => handleDifficulty(hard)} style={{ width: '200px' }}>HARD</button>
                    </div>
                </div>


                {/* background div */}
                <div className="background" style={{ position: 'relative', height: lowerwall, width: rightwall, border: '7px solid black', backgroundImage: `url(${background1})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 1, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }} >

                    {/* BIRD div */}
                    <div className="bird" style={{
                        height: birdHeight,
                        width: birdwidth,
                        backgroundImage: `url(${selectbird})`,
                        zIndex: '3',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '100%',
                        position: 'absolute',
                        left: birdposition,
                        top: jump,
                    }}></div>

                    {/* Obstacle PIPE div */}
                    <div className="pipe" style={{ position: 'absolute', height: '950px', width: '1200px', display: 'flex', flexDirection: 'column', overflow: 'hidden', left: 0, top: 0, zIndex: 3 }} >

                        {/* TOP PIPE */}
                        <div className="topPipe" style={{ height: (heightRef.current - 200), width: pipewidth, transform: 'rotate(180deg)', backgroundImage: `url(${obstacles})`, backgroundRepeat: 'no-repeat', backgroundSize: '100%', position: 'relative', top: 0, left: moveleft }} ></div>

                        {/* GAP DIV */}
                        <div className="gap" style={{ height: '400px', width: pipewidth, position: 'relative', left: `${moveleft}px` }} ></div>

                        {/* BOTTOM PIPE */}
                        <div className="bottomPipe" style={{ height: (lowerwall - heightRef.current - 200), width: pipewidth, backgroundImage: `url(${obstacles})`, backgroundRepeat: 'no-repeat', backgroundSize: '100%', position: 'relative', bottom: 0, left: moveleft }} ></div>

                    </div>

                </div>

                {/* div for highScore and bird selection */}
                <div className="settings" style={{ position: 'absolute', top: 0, right: 0, height: '100vh', width: '25vw', zIndex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '30px' }}>

                    {/* SCORE UPDATE */}
                    <div className="scoreDiv" style={{ fontFamily: 'Retro Gaming', fontSize: '30px', display: 'flex', gap: '50px', position: 'absolute', top: 20 }}>
                        <div style={{ textAlign: 'center', left: 10 }}>SCORE <br /> {score}</div>
                        <div style={{ textAlign: 'center', right: 0 }}>HIGH SCORE <br /> {highscore}</div>
                    </div>

                    {/* Select BIRD */}
                    <div className="selectbirds" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '30px' }}>

                        <div style={{ fontFamily: "Retro Gaming" }} ><h1>CHARACTER</h1></div>

                        <button className='game-button' onClick={() => handleBird(blueBird)} style={{ height: '100px', width: '100px' }} >
                            <div style={{
                                height: '100px', width: '100px', marginLeft: '-12px', backgroundImage: `url(${blueBird})`, backgroundRepeat: 'no-repeat', backgroundSize: '95%', backgroundColor: 'rgba(0, 174, 239, 0)', justifyContent: 'center', alignItems: 'center'
                            }}></div>
                        </button>

                        <button className='game-button red' onClick={() => handleBird(redBird)} style={{ height: '100px', width: '100px' }} >
                            <div style={{
                                height: '100px', width: '100px', marginLeft: '-12px', backgroundImage: `url(${redBird})`, backgroundRepeat: 'no-repeat', backgroundSize: '85%', backgroundColor: 'rgba(255, 70, 67, 0)'
                            }} ></div>
                        </button>

                        <button className='game-button orange' onClick={() => handleBird(YellowBird)} style={{ height: '100px', width: '100px' }} >
                            <div style={{
                                height: '100px', width: '100px', marginLeft: '-12px', backgroundImage: `url(${YellowBird})`, backgroundRepeat: 'no-repeat', backgroundSize: '95%', backgroundColor: 'rgba(255, 204, 0, 0)'
                            }} ></div>
                        </button>

                    </div>
                </div>

            </div>

        </>
    )
}

export default Game