package position_go

import (
	"github.com/mitchellh/mapstructure"
	"go.temporal.io/sdk/workflow"
	"math"
)

type GameInfo struct {
	AnchorX       int     `json:"anchorX"`
	AnchorY       int     `json:"anchorY"`
	BallX         int     `json:"ballX"`
	BallY         int     `json:"ballY"`
	Length        int     `json:"length"`
	Width         int     `json:"width"`
	Height        int     `json:"height"`
	Angle         float64 `json:"angle"`
	AngleAccel    float64 `json:"angleAccel"`
	AngleVelocity float64 `json:"angleVelocity"`
	Dt            float64 `json:"dt"`
	Speed         int     `json:"speed"`
}

const (
	ExitSignalName = "exit"
	MoveSignalName = "move"
	SetupMoveSignalName = "setupMove"
	UpdateGameInfoSignalName  = "updateGameInfo"
)

func PositionWorkflow(ctx workflow.Context, info GameInfo) error {
	//logger := workflow.GetLogger(ctx)

	gameInfo := info

	// Query Handler
	queryType := "getGameInfo"
	err := workflow.SetQueryHandler(ctx, queryType, func() (GameInfo, error) {
		return gameInfo, nil
	})
	if err != nil {
		return err
	}

	// Signals
	moveSignalChannel := workflow.GetSignalChannel(ctx, MoveSignalName)
	setupMoveSignalChannel := workflow.GetSignalChannel(ctx, SetupMoveSignalName)
	updateGameInfoSignalChannel := workflow.GetSignalChannel(ctx, UpdateGameInfoSignalName)
	exitSignalChannel := workflow.GetSignalChannel(ctx, ExitSignalName)

	selector := workflow.NewSelector(ctx)

	var signalExit bool
	selector.AddReceive(exitSignalChannel, func(c workflow.ReceiveChannel, _ bool) {
		var signal interface{}
		c.Receive(ctx, &signal)
		signalExit = true
	})
	selector.AddReceive(moveSignalChannel, func(c workflow.ReceiveChannel, _ bool) {
		var signal interface{}
		c.Receive(ctx, &signal)

		gameInfo.AnchorX = gameInfo.Width / 2
		gameInfo.AnchorY = gameInfo.Height / 4

		gameInfo.BallX = int(float64(gameInfo.AnchorX) + math.Sin(gameInfo.Angle) * float64(gameInfo.Length))
		gameInfo.BallY = int(float64(gameInfo.AnchorY) + math.Cos(gameInfo.Angle) * float64(gameInfo.Length))

	})
	selector.AddReceive(setupMoveSignalChannel, func(c workflow.ReceiveChannel, _ bool) {
		var signal interface{}
		c.Receive(ctx, &signal)

		gameInfo.AngleAccel = -9.81 / float64(gameInfo.Length) * math.Sin(gameInfo.Angle)
		gameInfo.AngleVelocity += gameInfo.AngleAccel * gameInfo.Dt
		gameInfo.Angle += gameInfo.AngleVelocity * gameInfo.Dt
	})
	selector.AddReceive(updateGameInfoSignalChannel, func(c workflow.ReceiveChannel, _ bool) {
		var rawSignalVal interface{}
		c.Receive(ctx, &rawSignalVal)

		var signalVal GameInfo
		mapstructure.Decode(rawSignalVal, &signalVal)
		gameInfo = signalVal

	})

	for {
		// Can also use `Receive()` instead of a selector, but we'll be making further
		// use of selectors in part 2 of this series.
		selector.Select(ctx)
		if signalExit {
			return nil
		}
	}
}
