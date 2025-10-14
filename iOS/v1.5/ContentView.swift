//
//  ContentView.swift
//  SemanticSNS
//
//  Created by Tasuku Kato on 2025/10/13.
//

import SwiftUI
import PhotosUI

struct Post: Identifiable, Codable {
    let id = UUID()
    let caption: String
    let imageUrl: String
}

struct ContentView: View {
    @StateObject private var service = SemanticService()
    @State private var selectedItem: PhotosPickerItem? = nil
    @State private var selectedImage: UIImage? = nil
    @State private var posts: [Post] = []
    @State private var showAlert = false

    var body: some View {
        NavigationView {
            VStack {
                // 投稿フォーム
                PhotosPicker(selection: $selectedItem, matching: .images) {
                    Label("画像を選択", systemImage: "photo")
                }
                .onChange(of: selectedItem) {
                    Task {
                        if let data = try? await selectedItem?.loadTransferable(type: Data.self),
                           let image = UIImage(data: data) {
                            selectedImage = image
                        }
                    }
                }
                .padding()

                if let image = selectedImage {
                    Image(uiImage: image)
                        .resizable()
                        .scaledToFit()
                        .frame(maxHeight: 200)
                        .cornerRadius(8)
                        .padding(.horizontal)
                }

                Button {
                    Task { await postImage() }
                } label: {
                    Text(service.isLoading ? "送信中..." : "意味送信（投稿）")
                        .bold()
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(service.isLoading ? Color.gray : Color.blue)
                        .foregroundColor(.white)
                        .cornerRadius(12)
                }
                .disabled(service.isLoading || selectedImage == nil)
                .padding(.horizontal)

                Divider().padding(.vertical, 8)

                // タイムライン
                ScrollView {
                    LazyVStack(spacing: 16) {
                        ForEach(posts.reversed()) { post in
                            VStack(alignment: .leading, spacing: 8) {
                                AsyncImage(url: URL(string: post.imageUrl)) { image in
                                    image.resizable()
                                         .scaledToFit()
                                         .cornerRadius(10)
                                } placeholder: {
                                    ProgressView()
                                }
                                Text(post.caption)
                                    .font(.footnote)
                                    .foregroundColor(.gray)
                            }
                            .padding(.horizontal)
                        }
                    }
                }
            }
            .navigationTitle("Semantic SNS")
            .alert("エラー", isPresented: $showAlert) {
                Button("OK", role: .cancel) { }
            } message: {
                Text(service.errorMessage ?? "不明なエラー")
            }
        }
    }

    private func postImage() async {
        guard let image = selectedImage else { return }
        if let response = await service.uploadImageAndGenerate(from: image) {
            posts.append(Post(caption: response.caption, imageUrl: response.imageUrl))
            selectedImage = nil
        } else {
            showAlert = true
        }
    }
}
