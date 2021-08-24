package io.temporal.demo.pendulum;

import io.temporal.client.WorkflowClient;

import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.util.HashMap;
import java.util.Map;
import javax.swing.*;

public class Pendulum extends JPanel implements Runnable {

    private static Map<String, PositionWorkflow> workflows = new HashMap<>();
    private static Map<String, Color> workflowColors = new HashMap<>();
    private static String workflowLang = "java";

    public Pendulum() {
        setDoubleBuffered(true);
    }

    @Override
    public void paint(Graphics g) {
        g.setColor(Color.WHITE);
        g.fillRect(0, 0, getWidth(), getHeight());
        g.setColor(workflowColors.get(workflowLang));

        workflows.get(workflowLang).move();
        try { Thread.sleep(25); } catch (InterruptedException ex) {}
        GameInfo updatedGameInfo = workflows.get(workflowLang).getGameInfo();
        g.drawLine(updatedGameInfo.getAnchorX(), updatedGameInfo.getAnchorY(),
                updatedGameInfo.getBallX(), updatedGameInfo.getBallY());
        g.fillOval(updatedGameInfo.getAnchorX() - 3, updatedGameInfo.getAnchorY() - 4, 7, 7);
        g.fillOval(updatedGameInfo.getBallX() - 7, updatedGameInfo.getBallY() - 7, 14, 14);
    }

    public void run() {
        while (true) {
            workflows.get(workflowLang).setupMove();
            repaint();
            try { Thread.sleep(35); } catch (InterruptedException ex) {}
        }
    }

    @Override
    public Dimension getPreferredSize() {
        return new Dimension(2 * workflows.get(workflowLang).getGameInfo().getLength() + 50, workflows.get(workflowLang).getGameInfo().getLength() / 2 * 3);
    }

    public static void main(String[] args) {
        WorkflowClient.start(WorkflowUtils.javaPositionWorkflow::exec, WorkflowUtils.getDefaultGameInfo());
        WorkflowClient.start(WorkflowUtils.phpPositionWorkflow::exec, WorkflowUtils.getDefaultGameInfo());
        WorkflowClient.start(WorkflowUtils.goPositionWorkflow::exec, WorkflowUtils.getDefaultGameInfo());

        workflows.put("java", WorkflowUtils.javaPositionWorkflow);
        workflows.put("php", WorkflowUtils.phpPositionWorkflow);
        workflows.put("go", WorkflowUtils.goPositionWorkflow);

        workflowColors.put("java", Color.BLUE);
        workflowColors.put("php", Color.ORANGE);
        workflowColors.put("go", Color.RED);

        JFrame jFrame = new JFrame("Temporal Pendulum");
        jFrame.setLayout(new FlowLayout());

        JButton javaButton = new JButton("Java");
        javaButton.setBackground(Color.BLUE);
        javaButton.setOpaque(true);
        javaButton.setBorderPainted(false);
        javaButton.setForeground(Color.WHITE);
        javaButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                GameInfo gameInfo = workflows.get(workflowLang).getGameInfo();
                workflowLang = "java";
                workflows.get(workflowLang).updateGameInfo(gameInfo);
                workflows.get(workflowLang).setupMove();
                try { Thread.sleep(30); } catch (InterruptedException ex) {}
            }
        });

        JButton phpButton = new JButton("PHP");
        phpButton.setBackground(Color.ORANGE);
        phpButton.setOpaque(true);
        phpButton.setBorderPainted(false);
        phpButton.setForeground(Color.BLACK);
        phpButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                GameInfo gameInfo = workflows.get(workflowLang).getGameInfo();
                workflowLang = "php";
                workflows.get(workflowLang).updateGameInfo(gameInfo);
                workflows.get(workflowLang).setupMove();
                try { Thread.sleep(30); } catch (InterruptedException ex) {}
            }
        });

        JButton goButton = new JButton("Go");
        goButton.setBackground(Color.RED);
        goButton.setOpaque(true);
        goButton.setBorderPainted(false);
        goButton.setForeground(Color.BLACK);
        goButton.addActionListener(new ActionListener() {

            @Override
            public void actionPerformed(ActionEvent e) {
                GameInfo gameInfo = workflows.get(workflowLang).getGameInfo();
                workflowLang = "go";
                workflows.get(workflowLang).updateGameInfo(gameInfo);
                workflows.get(workflowLang).setupMove();
                try { Thread.sleep(30); } catch (InterruptedException ex) {}
            }
        });

        EventQueue.invokeLater(() -> {
            Pendulum pendulumGame = new Pendulum();
            jFrame.add(pendulumGame);
            jFrame.add(javaButton);
            jFrame.add(phpButton);
            jFrame.add(goButton);
            jFrame.addWindowListener(new WindowAdapter() {
                @Override
                public void windowClosing(WindowEvent e) {
                    WorkflowUtils.javaPositionWorkflow.exit();
                    WorkflowUtils.phpPositionWorkflow.exit();
                    WorkflowUtils.goPositionWorkflow.exit();
                    System.exit(0);
                }
            });

            jFrame.pack();
            jFrame.setVisible(true);

            new Thread(pendulumGame).start();
        });
    }
}
