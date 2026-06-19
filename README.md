<img src="./docs/icon_squooshed.png" alt="logo" width="100" height="100" align="right" />

# Browserosaurus for Apple Silicon

This is a maintained fork of
[`Browserosaurus`](https://github.com/will-stone/browserosaurus) — an
open-source browser prompter for macOS whose original development has ended.
This fork independently adds features and keeps the app working on modern, Apple
Silicon Macs.

Browserosaurus sets itself as your default browser. When you click a link in a
non-browser app, it pops up a menu of your installed browsers so you can choose
where the link opens.

## 🚀 Main changes from upstream

- **Apple Silicon native**: builds now target `arm64` by default and are
  optimised for Apple Silicon (M-series) Macs. An Intel build is still available
  via `npm run make:intel` if ever needed.
- **Removed the donation popup**: the "Buy Me a Coffee" support popup has been
  fully removed, including all of its state wiring and the donation URL embedded
  in the bundle.
- **Maintenance — dependencies updated to 2026**: upgraded Electron `33 → 42`
  (Chromium 130 → 148), restoring current security-patch coverage, and refreshed
  the related toolchain.
- **Build fix**: local production builds previously failed because they were
  wired to the original author's Apple Developer signing credentials. Local
  builds are now ad-hoc signed and produce a working `.dmg` without those
  credentials.

### Install

1. Download the `arm64` `.dmg`, open it, and drag **Browserosaurus** into
   Applications.
2. Because this is a self-built, unsigned/un-notarised app, the first launch is
   blocked by Gatekeeper. Either **right-click the app → Open**, or clear the
   quarantine flag:
   ```sh
   xattr -dr com.apple.quarantine /Applications/Browserosaurus.app
   ```
3. Set Browserosaurus as your default browser in **System Settings → Desktop &
   Dock → Default web browser**.

## 📝 Original documentation

For the original app's features and full specification, see
[README_ORIGINAL.md](./README_ORIGINAL.md).

## ⚖️ License

This project follows the **same license as the original**:
[GPL-3.0-only](./LICENSE.md). As a fork of GPL-3.0 software, this project must
remain under GPL-3.0 (it is **not** MIT-licensed).

(C) 2026 Boss-Owl / Original work (C) Will Stone

---

# Browserosaurus for Apple Silicon（日本語）

本アプリは、開発が終了している
[`Browserosaurus`](https://github.com/will-stone/browserosaurus)（macOS用のブラ
ウザ選択アプリ）をベースに、独自に機能追加・メンテナンスを行っているフォーク版で
す。Apple Silicon Mac で問題なく動くことを主眼に維持しています。

Browserosaurus は自身をデフォルトブラウザに設定し、ブラウザ以外のアプリでリンク
をクリックすると、インストール済みブラウザの一覧をポップアップ表示して、どのブラ
ウザで開くかを選べるようにします。

## 🚀 本家からの主な変更点

- **Apple Silicon ネイティブ化**: デフォルトのビルドを `arm64` 専用にし、Apple
  Silicon（Mシリーズ）Mac に最適化しました。Intel版が必要な場合は
  `npm run make:intel` で生成できます。
- **寄付ポップアップの削除**: 「Buy Me a Coffee」の寄付ポップアップを、関連する
  state 配線およびバンドル内の寄付URLごと完全に削除しました。
- **メンテ（依存ライブラリを2026年現在の最新版に更新）**: Electron を
  `33 → 42`（Chromium 130 → 148）にアップグレードし、最新のセキュリティパッチが
  効く状態に戻しました。
- **バグ修正（ビルド失敗の修正）**: 従来、本家のビルド設定は元開発者の Apple
  Developer 証明書を前提としており、手元でのビルドが失敗していました。これを
  ad-hoc 署名に変更し、証明書なしでも動作する `.dmg` を生成できるようにしまし
  た。

### インストール

1. `arm64` 版の `.dmg` をダウンロードして開き、**Browserosaurus** を
   Applications にドラッグします。
2. 自前ビルドの未署名・未公証アプリのため、初回起動は Gatekeeper にブロックされ
   ます。**アプリを右クリック →「開く」** とするか、隔離属性を解除してください：
   ```sh
   xattr -dr com.apple.quarantine /Applications/Browserosaurus.app
   ```
3. **システム設定 → デスクトップとDock → デフォルトWebブラウザ** で
   Browserosaurus を選択します。

## 📝 オリジナルのドキュメント

元のアプリの機能や仕様については、[README_ORIGINAL.md](./README_ORIGINAL.md) を
ご参照ください。

## ⚖️ ライセンス

本プロジェクトは、元のプロジェクトと**同じライセンス**
[GPL-3.0-only](./LICENSE.md) に従います。GPL-3.0 ソフトウェアのフォークであるた
め、本プロジェクトも GPL-3.0 を維持する必要があります（MIT ではありません）。

(C) 2026 Boss-Owl / Original work (C) Will Stone
