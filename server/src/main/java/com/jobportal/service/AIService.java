package com.jobportal.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class AIService {

    private final ChatClient chatClient;
    private final EmbeddingModel embeddingModel;
    private final VectorStore vectorStore;
    private final ObjectMapper objectMapper;

    public AIService(ChatClient.Builder chatClientBuilder,
            EmbeddingModel embeddingModel,
            VectorStore vectorStore) {
        this.chatClient = chatClientBuilder.build();
        this.embeddingModel = embeddingModel;
        this.vectorStore = vectorStore;
        this.objectMapper = new ObjectMapper();
    }

    // ── Generate Embedding using Spring AI EmbeddingModel ──
    public List<Double> generateEmbedding(String text) {
        if (text == null || text.trim().isEmpty()) {
            return new java.util.ArrayList<>();
        }

        System.out.println("🤖 Spring AI: Generating embedding for text length: " + text.length());
        float[] floats = embeddingModel.embed(text);
        List<Double> vector = new java.util.ArrayList<>(floats.length);
        for (float f : floats) {
            vector.add((double) f);
        }
        System.out.println("✅ Spring AI: Generated vector of size: " + vector.size());
        return vector;
    }

    // ── Store document in MongoDB Atlas Vector Store ──
    public void storeInVectorStore(String id, String content, Map<String, Object> metadata) {
        Document doc = new Document(id, content, metadata);
        vectorStore.add(List.of(doc));
        System.out.println("✅ Spring AI VectorStore: Stored document id=" + id);
    }

    // ── Search similar documents from MongoDB Atlas Vector Store ──
    public List<Document> searchSimilar(String query, int topK) {
        SearchRequest request = SearchRequest.builder()
                .query(query)
                .topK(topK)
                .build();
        return vectorStore.similaritySearch(request);
    }

    // ── Cosine Similarity (kept as fallback for direct 1-to-1 comparison) ──
    public double calculateCosineSimilarity(List<Double> vectorA, List<Double> vectorB) {
        if (vectorA == null || vectorB == null || vectorA.isEmpty() || vectorB.isEmpty()
                || vectorA.size() != vectorB.size()) {
            return 0.0;
        }

        double dotProduct = 0.0;
        double normA = 0.0;
        double normB = 0.0;

        for (int i = 0; i < vectorA.size(); i++) {
            dotProduct += vectorA.get(i) * vectorB.get(i);
            normA += Math.pow(vectorA.get(i), 2);
            normB += Math.pow(vectorB.get(i), 2);
        }

        if (normA == 0.0 || normB == 0.0) {
            return 0.0;
        }

        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    // ── Basic Resume Analysis (uses Spring AI ChatClient) ──
    public String analyzeResume(String resumeText, String jobDescription) {
        String prompt = "You are an expert HR Technical Recruiter. Please analyze the following resume against the provided job description.\n\n" +
                "Job Description:\n" + jobDescription + "\n\n" +
                "Resume:\n" + resumeText + "\n\n" +
                "Provide a JSON response STRICTLY in the following exact format without any markdown wrappers (no ```json or backticks):\n" +
                "{\n" +
                "  \"matchScore\": 85,\n" +
                "  \"aiExplanation\": \"The candidate is a strong fit...\",\n" +
                "  \"requiredSkills\": [\"Java\", \"Spring Boot\"],\n" +
                "  \"candidateSkills\": [\"Java\", \"React\"]\n" +
                "}";

        try {
            String aiResponseText = chatClient.prompt()
                    .user(prompt)
                    .call()
                    .content();

            JsonNode rootNode = objectMapper.readTree(aiResponseText);
            String jsonText = rootNode.toString();

            if (jsonText.startsWith("```json")) {
                jsonText = jsonText.substring(7);
            }
            if (jsonText.endsWith("```")) {
                jsonText = jsonText.substring(0, jsonText.length() - 3);
            }
            return jsonText.trim();
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"matchScore\": 0, \"aiExplanation\": \"Error analyzing resume via AI: " + e.getMessage() + "\"}";
        }
    }

    // ── Advanced Resume Analysis with RAG Vector Search Score ──
    public String analyzeResumeAdvanced(String resumeText, String jobDescription, double matchScoreFromVectorSearch) {
        int vectorScorePercentage = (int) Math.round(Math.max(0, matchScoreFromVectorSearch) * 100);

        String prompt = "You are an expert HR Technical Recruiter AI powering a RAG Vector Search pipeline.\n" +
                "We have internally calculated a mathematical Cosine Similarity Score of " + vectorScorePercentage
                + "% between the job description embeddings and the candidate's resume embeddings.\n\n" +
                "Job Description:\n" + jobDescription + "\n\n" +
                "Resume:\n" + resumeText + "\n\n" +
                "Your task:\n" +
                "1. Provide a FINAL adjusted matchScore (0-100). If the candidate matches well semantically, the score MUST be high (e.g. 85-100) regardless of the vector score. If the vector score is > 0, use it as a baseline.\n"
                +
                "2. Provide an aiExplanation explaining why they match, explicitly mentioning the alignment found via textual analysis. If the vector score was 0 but they are a strong match, explain that the semantic reading found strong alignment despite the vector gap.\n"
                +
                "Provide a JSON response STRICTLY in the following exact format without any markdown wrappers (no ```json or backticks):\n"
                +
                "{\n" +
                "  \"matchScore\": 92,\n" +
                "  \"aiExplanation\": \"The candidate is a strong fit...\",\n" +
                "  \"requiredSkills\": [\"Java\", \"Spring Boot\"],\n" +
                "  \"candidateSkills\": [\"Java\", \"React\"]\n" +
                "}";

        try {
            String aiResponseText = chatClient.prompt()
                    .user(prompt)
                    .call()
                    .content();

            JsonNode rootNode = objectMapper.readTree(aiResponseText);
            String jsonText = rootNode.toString();

            if (jsonText.startsWith("```json")) {
                jsonText = jsonText.substring(7);
            }
            if (jsonText.endsWith("```")) {
                jsonText = jsonText.substring(0, jsonText.length() - 3);
            }
            return jsonText.trim();
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"matchScore\": 0, \"aiExplanation\": \"Error analyzing resume via AI: " + e.getMessage() + "\"}";
        }
    }
}
