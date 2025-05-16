// set-1.jsx
// Requires: npm install framer-motion react-confetti react-icons jspdf
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { FaShareAlt, FaRedo, FaFilePdf, FaList } from "react-icons/fa";
import { jsPDF } from "jspdf";
import useWindowSize from "../../../utility/useWindowSize";
import styles from "./ui_alhaan_q.module.css";
import { GraduationCap } from "lucide-react";
import signatureImage from "../../../../public/signature.png";
import allQuestions from "../../questions/Alhaan/alhaan.json";

// Shuffle and pick 50 questions
const questions = allQuestions.sort(() => Math.random() - 0.5).slice(0, 50);

questions.forEach((question) => {
  question.options = question.options.sort(() => Math.random() - 0.5);
});

const Quiz = ({ participantName }) => {
  const [idx, setIdx] = useState(0);
  const [sel, setSel] = useState("");
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);
  const [responses, setResponses] = useState([]);
  const current = questions[idx];
  const progress = ((idx + (answered ? 1 : 0)) / questions.length) * 100;

  useEffect(() => {
    if (typeof window !== "undefined")
      window.scrollTo({ top: 0, behavior: "smooth" });
  }, [idx]);

  const onSelect = (opt) => {
    if (answered) return;
    setSel(opt);
    setAnswered(true);
    const correct = opt === current.answer;
    if (correct) setScore((s) => s + 1);
    setResponses((prev) => [
      ...prev,
      { question: current.question, selected: opt, correct },
    ]);
  };

  const onNext = () => {
    if (!answered) return;
    if (idx < questions.length - 1) {
      setIdx((i) => i + 1);
      setSel("");
      setAnswered(false);
    } else {
      setFinished(true);
    }
  };

  const onRestart = () => {
    setIdx(0);
    setSel("");
    setScore(0);
    setAnswered(false);
    setFinished(false);
    setResponses([]);
  };

  // Circular indicator
  const pct = Math.round((score / questions.length) * 100);
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - pct / 100);

  const generateReport = () => {
    // Start directly with Portrait A4
    const doc = new jsPDF({
      unit: "pt",
      format: "a4",
      orientation: "portrait",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 50;
    let y = margin;

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(0);
    doc.text("Performance Summary", pageWidth / 2, y, { align: "center" });
    y += 30;

    // Metrics Table
    const colMetricWidth = 200;
    const colValueWidth = 150;
    const totalWidth = colMetricWidth + colValueWidth;
    const tableX = (pageWidth - totalWidth) / 2;
    const rowHeight = 26;

    // Table Header
    doc.setFillColor(230);
    doc.rect(tableX, y, colMetricWidth, rowHeight, "F");
    doc.rect(tableX + colMetricWidth, y, colValueWidth, rowHeight, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Metric", tableX + 10, y + 16);
    doc.text("Value", tableX + colMetricWidth + 10, y + 16);
    y += rowHeight;

    // Table Rows
    doc.setFont("helvetica", "normal");
    const metrics = [
      { label: "Total Questions", value: questions.length },
      { label: "Correct Answers", value: score },
      { label: "Wrong Answers", value: questions.length - score },
      { label: "Percentage Achieved", value: `${pct}%` },
    ];

    metrics.forEach((m) => {
      doc.setDrawColor(180);
      doc.rect(tableX, y, colMetricWidth, rowHeight);
      doc.rect(tableX + colMetricWidth, y, colValueWidth, rowHeight);
      doc.text(m.label, tableX + 10, y + 16);
      doc.text(String(m.value), tableX + colMetricWidth + 10, y + 16);
      y += rowHeight;
    });

    // Space before next section
    y += 40;

    // Quiz Attempt Details
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Quiz Attempt Details", margin, y);
    y += 20;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    responses.forEach((r, i) => {
      if (y > pageHeight - margin - 100) {
        doc.addPage(); // If reaching bottom, add new page
        y = margin;
        doc.setFontSize(11);
      }
      const qText = `${i + 1}. ${r.question}`;
      const qLines = doc.splitTextToSize(qText, pageWidth - 2 * margin);
      doc.setFont("helvetica", "bold");
      doc.text(qLines, margin, y);
      y += qLines.length * 14 + 5;

      const ansText = `Your Answer: ${r.selected} (${
        r.correct ? "Correct" : "Wrong"
      })`;
      const ansLines = doc.splitTextToSize(
        ansText,
        pageWidth - 2 * margin - 20
      );
      doc.setFont("helvetica", "normal");
      doc.text(ansLines, margin + 20, y);
      y += ansLines.length * 14 + 10;

      // Line separator
      doc.setDrawColor(200);
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageWidth - margin, y);
      y += 15;
    });

    // Save the PDF
    doc.save("RNotion_Performance_Report.pdf");
  };

  const generateCertificate = () => {
    const doc = new jsPDF({
      unit: "pt",
      format: "a4",
      orientation: "landscape",
    });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 50;

    // 1. Light background to look premium
    doc.setFillColor(245, 245, 245);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    // 2. Double Border
    doc.setDrawColor(70, 70, 70);
    doc.setLineWidth(4);
    doc.rect(margin / 2, margin / 2, pageWidth - margin, pageHeight - margin);

    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(1);
    doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);

    // 3. Title
    doc.setFont("times", "bolditalic");
    doc.setTextColor(30, 30, 80);
    doc.setFontSize(48);
    doc.text("Certificate of Completion", pageWidth / 2, margin + 60, {
      align: "center",
    });

    // 4. Subtitle
    doc.setFont("helvetica", "bold");
    doc.setFontSize(30);
    doc.setTextColor(50, 50, 90);
    doc.text("RNotion Challenge", pageWidth / 2, margin + 120, {
      align: "center",
    });

    // 5. Issuer line
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.setTextColor(80, 80, 80);
    doc.text("by Rayyan's Notion", pageWidth / 2, margin + 150, {
      align: "center",
    });

    // 6. Horizontal separator
    doc.setDrawColor(100, 100, 100);
    doc.setLineWidth(0.5);
    doc.line(
      pageWidth / 2 - 200,
      margin + 170,
      pageWidth / 2 + 200,
      margin + 170
    );

    // 7. Certification Text
    doc.setFont("times", "normal");
    doc.setFontSize(18);
    doc.setTextColor(30, 30, 30);
    const certText = "This certifies that";
    doc.text(certText, pageWidth / 2, margin + 220, { align: "center" });

    // 8. Participant Name (Highlight)
    doc.setFont("times", "bold");
    doc.setFontSize(42);
    doc.setTextColor(20, 20, 80);
    doc.text(`${participantName}`, pageWidth / 2, margin + 270, {
      align: "center",
    });

    // 9. Achievement text
    doc.setFont("times", "normal");
    doc.setFontSize(16);
    doc.setTextColor(50, 50, 50);
    const achievementText = `has successfully completed the RNotion Challenge on`;
    doc.text(achievementText, pageWidth / 2, margin + 310, { align: "center" });

    doc.setFont("times", "bold");
    doc.setFontSize(20);
    doc.setTextColor(30, 30, 70);
    doc.text('"Natural Language Processing"', pageWidth / 2, margin + 340, {
      align: "center",
    });

    const description =
      "Demonstrating outstanding knowledge, critical thinking, and commitment to excellence.";
    const descLines = doc.splitTextToSize(
      description,
      pageWidth - 2 * margin - 100
    );
    doc.setFont("times", "normal");
    doc.setFontSize(14);
    doc.text(descLines, pageWidth / 2, margin + 380, { align: "center" });

    // 10. Date and Certificate ID at bottom
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text("Date: 28 May 2025", margin + 20, pageHeight - margin - 30);
    doc.text(
      "Certificate ID: SN-58674E4",
      pageWidth - margin - 20,
      pageHeight - margin - 30,
      { align: "right" }
    );

    // 11. Signature Section
    const imgWidth = 120;
    const imgHeight = 50;
    const imgX = pageWidth / 2 - imgWidth / 2;
    const imgY = pageHeight - margin - imgHeight - 40;

    doc.addImage(signatureImage, "PNG", imgX, imgY, imgWidth, imgHeight);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(14);
    doc.setTextColor(50, 50, 50);
    doc.text("Authorized Signature", pageWidth / 2, pageHeight - margin - 20, {
      align: "center",
    });

    // SAVE
    doc.save("Official_RNotion_Certificate.pdf");
  };

  return (
    <div className={styles.wrapper}>
      <motion.div
        className={styles.quizContainer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {!finished ? (
          <AnimatePresence exitBeforeEnter>
            <motion.div
              key={idx}
              className={styles.quiz}
              layout
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div className={styles.progressBar}>
                <motion.div
                  className={styles.progress}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>










              <div className={styles.questionHeader}>
                <span className={styles.questionNumber}>
                  Question {idx + 1} of {questions.length}
                </span>
                <span
                  className={`${styles.questionTag} ${
                    styles[current.tag.toLowerCase()]
                  }`}
                >
                  {current.tag}
                </span>
              </div>









              <motion.h2
                className={styles.question}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {current.question}
              </motion.h2>
              <div className={styles.options}>
                {current.options.map((opt) => {
                  const isCorrect = answered && opt === current.answer;
                  const isWrong = answered && opt === sel && !isCorrect;
                  return (
                    <motion.button
                      key={opt}
                      onClick={() => onSelect(opt)}
                      disabled={answered}
                      className={`${styles.option} ${
                        isCorrect ? styles.correct : ""
                      } ${isWrong ? styles.incorrect : ""} ${
                        sel === opt && !answered ? styles.selected : ""
                      }`}
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 50, opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 20,
                      }}
                      whileHover={{ scale: answered ? 1 : 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {opt}
                    </motion.button>
                  );
                })}
              </div>
              <motion.button
                className={styles.nextButton}
                onClick={onNext}
                disabled={!answered}
                whileHover={{ scale: answered ? 1.02 : 1 }}
                whileTap={{ scale: answered ? 0.98 : 1 }}
              >
                {idx === questions.length - 1 ? "Finish" : "Next"}
              </motion.button>
            </motion.div>
          </AnimatePresence>
        ) : (
          <motion.div
            className={styles.results}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2>
              <sub>
                <GraduationCap size={70} />
              </sub>
              &nbsp;&nbsp;<sup>RNotion Challenge</sup>
            </h2>
            <h3>It's Time to See Mirror !</h3>
            <div className={styles.chartContainer}>
              <svg width="140" height="140">
                <circle
                  className={styles.bgCircle}
                  cx="70"
                  cy="70"
                  r={radius}
                  strokeWidth="10"
                />
                <motion.circle
                  className={styles.fgCircle}
                  cx="70"
                  cy="70"
                  r={radius}
                  strokeWidth="10"
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: dashOffset }}
                  transition={{ duration: 1 }}
                  style={{ strokeDasharray: circumference }}
                />
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={styles.chartText}
                >
                  {pct}%
                </text>
              </svg>
            </div>
            <p className={styles.feedback}>
              {pct === 100 ? (
                "Perfect score achieved."
              ) : pct >= 76 ? (
                "Excellent performance."
              ) : pct >= 40 ? (
                <>
                  Good Effort.
                  <br />
                  <span
                    style={{
                      fontSize: "1rem",
                      color: "red",
                      marginLeft: "8px",
                    }}
                  >
                    Scrore above 75% to get the certificate.
                  </span>
                </>
              ) : (
                <>
                  Continuous practice is recommended.
                  <br />
                  <span
                    style={{
                      fontSize: "1rem",
                      color: "red",
                      marginLeft: "8px",
                    }}
                  >
                    Scrore above 75% to get the certificate.
                  </span>
                </>
              )}
            </p>
            {pct > 75 ? (
              <h3 className={styles.reportHeader}></h3>
            ) : (
              <h3 className={styles.reportHeader}></h3>
            )}

            {pct > 75 ? (
              <button
                className={styles.pdfButton}
                onClick={() => {
                  generateCertificate();
                  generateReport();
                }}
              >
                <FaFilePdf /> Download Certificate & Report
              </button>
            ) : (
              <button className={styles.pdfButton} onClick={generateReport}>
                <FaFilePdf /> Download Report
              </button>
            )}

            {/* )} */}
            <div className={styles.actions}>
              <button onClick={onRestart} className={styles.restartButton}>
                <FaRedo /> Restart
              </button>
              <button
                onClick={() => alert("Share feature coming soon!")}
                className={styles.shareButton}
              >
                <FaShareAlt /> Share
              </button>
            </div>
          </motion.div>
        )}
        {finished && pct > 75 && (
          <div
            style={{
              border: "5px solid black",
              borderRadius: "10px",
              position: "absolute",
              top: "-30%",
              left: "-100%",
            }}
          >
            <Confetti
              width={1536}
              height={776}
              recycle={false}
              numberOfPieces={200} // More pieces for a denser effect
              duration={1000}
              bounce={true} // Enable bounce effect
              randomness={true} // Randomize confetti size, angle, etc.
              // gravity={}          // Faster falling confetti
              // initialVelocityX={10}  // Optional: Control the initial horizontal velocity
              // initialVelocityY={15}  // Optional: Control the initial vertical velocity
            />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Quiz;
