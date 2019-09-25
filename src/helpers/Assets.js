// All the assets used in the game
// This loads all the assets and then starts the game

const LoadAssetsAndStart = (assetManager, main) => {
    const __dirname = "./";
    const dir = __dirname + "resources/images/"
    const paths = [
        "bubbles/ball_blue.png",
        "bubbles/ball_green.png",
        "bubbles/ball_purple.png",
        "bubbles/ball_red.png",
        "bubbles/ball_yellow.png",

        "particles/gleam_blue.png",
        "particles/round_blue.png",
        "particles/gleam_green.png",
        "particles/round_green.png",
        "particles/gleam_purple.png",
        "particles/round_purple.png",
        "particles/gleam_red.png",
        "particles/round_red.png",
        "particles/gleam_yellow.png",
        "particles/round_yellow.png",
        "particles/gleam_white.png",
        "particles/round_white.png",

        "ui/bg1_center.png",
        "ui/bg1_header.png",
        "ui/cannon_base.png",
        "ui/cannon_top.png",
        "ui/crosshair.png",
    ]
    assetManager.init(dir, paths, main);
}

export default LoadAssetsAndStart;