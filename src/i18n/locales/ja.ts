export default {
  common: {
    loading: '読み込み中...',
    error: 'エラーが発生しました',
    back: '戻る',
    cancel: 'キャンセル',
    save: '保存',
    edit: '編集',
    delete: '削除',
    submit: '送信',
    language: '言語',
    welcome: 'ようこそ、{{name}}さん',
    noData: 'データがありません'
  },
  auth: {
    login: 'ログイン',
    logout: 'ログアウト',
    email: 'メールアドレス',
    password: 'パスワード',
    signIn: 'サインイン',
    adminLogin: '管理者ログイン',
    studentLogin: '学生ログイン',
    adminAccess: '管理者アクセス',
    studentAccess: '学生アクセス',
    manageTrainings: '管理者として、トレーニング、学生、進捗状況を管理',
    accessCourses: '登録したコースにアクセスし、学習進捗を追跡',
    needHelp: 'お困りですか？ support@upskill.com までご連絡ください',
    loginWithGoogle: 'Googleでサインイン',
    emailRestriction: '@manaable.com のメールアドレスのみ許可されています'
  },
  training: {
    title: 'トレーニングセッション',
    createTraining: 'トレーニングを作成',
    addLesson: 'レッスンを追加',
    addVideo: '動画を追加',
    addStudent: '学生を追加',
    enrolledStudents: '登録済みの学生',
    lessons: 'レッスン',
    startDate: '開始日',
    duration: '期間',
    maxStudents: '最大学生数',
    description: '説明',
    noTrainings: 'トレーニングセッションがありません',
    noLessons: 'レッスンが予定されていません',
    noStudents: '登録済みの学生がいません',
    readyToEnroll: '学生を登録する準備ができましたか？',
    enrollFirst: '最初の学生を登録',
    lessonNumber: 'レッスン #{{number}}',
    status: {
      upcoming: '近日開始',
      inProgress: '進行中',
      completed: '完了'
    }
  },
  video: {
    watchVideo: '動画を見る',
    invalidUrl: '無効な動画URL',
    youtubeVideo: 'YouTube動画',
    vimeoVideo: 'Vimeo動画',
    addVideoContent: '動画コンテンツを追加',
    videoTitle: '動画タイトル',
    videoUrl: '動画URL',
    videoProvider: '動画プロバイダー',
    selectProvider: 'プロバイダーを選択'
  },
  attendance: {
    joinTime: '参加時間',
    leaveTime: '退出時間',
    status: 'ステータス',
    percentage: '出席率',
    yourAttendance: 'あなたの出席状況',
    session: 'セッション {{number}}',
    completionThreshold: '完了しきい値',
    attendanceRecords: '出席記録'
  },
  zoom: {
    joinMeeting: 'ミーティングに参加',
    joining: '参加中...',
    meetingLink: 'ミーティングリンク',
    zoomMeeting: 'Zoomミーティング'
  }
};