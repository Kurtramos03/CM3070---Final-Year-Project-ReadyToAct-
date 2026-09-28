import React, { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { quizQuestions } from "../data/quiz";
import { addQuizResult } from "../storage/readinessStorage";
import { colors, globalStyles, spacing } from "../styles/globalStyles";

const QuizScreen = ({ navigation }) => {
  const [answers, setAnswers] = useState({});

  const selectAnswer = (questionId, optionIndex) => {
    setAnswers((current) => ({ ...current, [questionId]: optionIndex }));
  };

  const handleFinish = async () => {
    if (Object.keys(answers).length < quizQuestions.length) {
      Alert.alert("Quiz incomplete", "Please answer all questions before finishing.");
      return;
    }

    const correctCount = quizQuestions.filter((question) => answers[question.id] === question.answerIndex).length;
    const percent = Math.round((correctCount / quizQuestions.length) * 100);
    const result = {
      id: `quiz-${Date.now()}`,
      correctCount,
      total: quizQuestions.length,
      percent,
      createdAt: new Date().toISOString()
    };

    await addQuizResult(result);
    navigation.replace("QuizResult", { result });
  };

  return (
    <ScrollView style={globalStyles.screen} contentContainerStyle={globalStyles.content}>
      <Text style={globalStyles.title}>Readiness Quiz</Text>
      <Text style={globalStyles.subtitle}>
        Answer all questions. This quiz supports the preparedness learning part of ReadyToAct.
      </Text>

      {quizQuestions.map((question, questionIndex) => (
        <View key={question.id} style={globalStyles.card}>
          <Text style={{ color: colors.primary, fontWeight: "900", marginBottom: spacing.sm }}>
            Question {questionIndex + 1} of {quizQuestions.length}
          </Text>
          <Text style={[globalStyles.bodyText, { fontWeight: "800", marginBottom: spacing.md }]}>{question.question}</Text>

          {question.options.map((option, optionIndex) => {
            const selected = answers[question.id] === optionIndex;
            return (
              <TouchableOpacity
                key={option}
                style={[globalStyles.compactCard, selected && { backgroundColor: "#E0F2FE", borderColor: "#7DD3FC" }]}
                onPress={() => selectAnswer(question.id, optionIndex)}
              >
                <Text style={{ color: selected ? colors.primary : colors.text, fontWeight: selected ? "900" : "600" }}>
                  {String.fromCharCode(65 + optionIndex)}. {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}

      <TouchableOpacity style={globalStyles.button} onPress={handleFinish}>
        <Text style={globalStyles.buttonText}>Finish quiz</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default QuizScreen;
