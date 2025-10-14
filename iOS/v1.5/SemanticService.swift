import Foundation
import UIKit
import Combine

struct SemanticResponse: Codable {
    let caption: String
    let imageUrl: String
}

@MainActor
final class SemanticService: ObservableObject {
    @Published var isLoading = false
    @Published var errorMessage: String? = nil

    private let workerURL = URL(string: "https://semantic-worker.semantic-compression.workers.dev/auto")!

    func uploadImageAndGenerate(from image: UIImage) async -> SemanticResponse? {
        isLoading = true
        defer { isLoading = false }

        guard let imageData = image.jpegData(compressionQuality: 0.7) else {
            errorMessage = "画像を処理できませんでした。"
            return nil
        }

        var request = URLRequest(url: workerURL)
        request.httpMethod = "POST"

        // multipart/form-dataの組み立て
        let boundary = UUID().uuidString
        request.setValue("multipart/form-data; boundary=\(boundary)", forHTTPHeaderField: "Content-Type")

        var body = Data()
        body.append("--\(boundary)\r\n".data(using: .utf8)!)
        body.append("Content-Disposition: form-data; name=\"file\"; filename=\"upload.jpg\"\r\n".data(using: .utf8)!)
        body.append("Content-Type: image/jpeg\r\n\r\n".data(using: .utf8)!)
        body.append(imageData)
        body.append("\r\n--\(boundary)--\r\n".data(using: .utf8)!)
        request.httpBody = body

        do {
            let (data, response) = try await URLSession.shared.data(for: request)
            guard let httpResponse = response as? HTTPURLResponse else { return nil }

            if httpResponse.statusCode == 200 {
                let decoded = try JSONDecoder().decode(SemanticResponse.self, from: data)
                return decoded
            } else {
                errorMessage = "サーバーエラー: \(httpResponse.statusCode)"
                print(String(data: data, encoding: .utf8) ?? "no response")
                return nil
            }
        } catch {
            errorMessage = "通信エラー: \(error.localizedDescription)"
            return nil
        }
    }
}
//
//  SemanticService.swift
//  SemanticSNS
//
//  Created by Tasuku Kato on 2025/10/13.
//

