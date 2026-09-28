import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { quizQuestions } from "../data/quiz";
import { colors, globalStyles, spacing } from "../styles/globalStyles";

const QuizResultScreen = ({ route, navigation }) => {
  const result = route?.params?.result;

  return (
    <ScrollView style={globalStyles.screen} contentContainerStyle={globalStyles.content}>
      <Text style={globalStyles.title}>Quiz Result</Text>
      <Text style={globalStyles.subtitle}>Your result has been saved and will contribute to your readiness score.</Text>

      <View style={globalStyles.card}>
        <Text style={{ fontSize: 42, fontWeight: "900", color: colors.primary }}>{result?.percent || 0}%</Text>
        <Text style={globalStyles.bodyText}>
          You answered {result?.correctCount || 0} out of {result?.total || quizQuestions.length} questions correctly.
        </Text>
      </View>

      <Text style={globalStyles.sectionTitle}>Answer explanations</Text>
      {quizQuestions.map((question, index) => (
        <View key={question.id} style={globalStyles.card}>
          <Text style={{ fontWeight: "900", color: colors.text }}>
            {index + 1}. {question.question}
          </Text>
          <Text style={[globalStyles.mutedText, { marginTop: spacing.sm }]}>{question.explanation}</Text>
        </View>
      ))}

      <TouchableOpacity style={globalStyles.button} onPress={() => navigation.popToTop()}>
        <Text style={globalStyles.buttonText}>Back to app</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default QuizResultScreen;
