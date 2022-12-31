enum toastTypes {
  error,
  success,
}
  
interface ToastData {
  title: string;
  content: string;
  show?: boolean;
  type?: toastTypes;
}