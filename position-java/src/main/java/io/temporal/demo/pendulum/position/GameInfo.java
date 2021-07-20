package io.temporal.demo.pendulum.position;

public class GameInfo {
    private int anchorX;
    private int anchorY;
    private int ballX;
    private int ballY;

    private int length;
    private int width;
    private int height;
    private double angle;
    private double angleAccel;
    private double angleVelocity;
    private double dt;

    private int speed;

    public GameInfo() {}

    public int getAnchorX() {
        return anchorX;
    }

    public void setAnchorX(int anchorX) {
        this.anchorX = anchorX;
    }

    public int getAnchorY() {
        return anchorY;
    }

    public void setAnchorY(int anchorY) {
        this.anchorY = anchorY;
    }

    public int getBallX() {
        return ballX;
    }

    public void setBallX(int ballX) {
        this.ballX = ballX;
    }

    public int getBallY() {
        return ballY;
    }

    public void setBallY(int ballY) {
        this.ballY = ballY;
    }

    public int getLength() {
        return length;
    }

    public void setLength(int length) {
        this.length = length;
    }

    public int getWidth() {
        return width;
    }

    public void setWidth(int width) {
        this.width = width;
    }

    public int getHeight() {
        return height;
    }

    public void setHeight(int height) {
        this.height = height;
    }

    public double getAngle() {
        return angle;
    }

    public void setAngle(double angle) {
        this.angle = angle;
    }

    public double getAngleAccel() {
        return angleAccel;
    }

    public void setAngleAccel(double angleAccel) {
        this.angleAccel = angleAccel;
    }

    public double getAngleVelocity() {
        return angleVelocity;
    }

    public void setAngleVelocity(double angleVelocity) {
        this.angleVelocity = angleVelocity;
    }

    public double getDt() {
        return dt;
    }

    public void setDt(double dt) {
        this.dt = dt;
    }

    public int getSpeed() {
        return speed;
    }

    public void setSpeed(int speed) {
        this.speed = speed;
    }

    @Override
    public String toString() {
        return "GameInfo{" +
                "anchorX=" + anchorX +
                ", anchorY=" + anchorY +
                ", ballX=" + ballX +
                ", ballY=" + ballY +
                ", length=" + length +
                ", width=" + width +
                ", height=" + height +
                ", angle=" + angle +
                ", angleAccel=" + angleAccel +
                ", angleVelocity=" + angleVelocity +
                ", dt=" + dt +
                ", speed=" + speed +
                '}';
    }
}
