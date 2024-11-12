import { BrowserRouter,Routes,Route } from "react-router-dom"
import Login from "./components/admin/Login"
import Dashboard from "./components/admin/Dashboard"
import CreateExam from "./components/admin/CreateExam"
import Home from "./components/admin/Home"
import ViewQuestions from "./components/admin/ViewQuestions"
import EditQuestion from "./components/admin/EditQuestion"
import './styles/dashboard.css'
import "bootstrap/dist/css/bootstrap.min.css"
import Createquiz from "./components/admin/Createquiz"
import UserHome from "./components/student/UserHome"
import StudentDashboard from "./components/student/StudentDashboard"
import StartExam from "./components/student/StartExam"
import Exam from "./components/student/Exam"
import EndExam from "./components/student/EndExam"
import UserRegister from "./components/student/UserRegister"
import { StreamProvider } from "./StreamContext"
import Reports from "./components/student/Reports"
import UpdateQuestion from "./components/admin/UpdateQuestion"
import Analysis from "./components/admin/Analysis"
import Proctor from "./components/admin/Proctor"
import MyExams from "./components/student/MyExams"

function App() {

  return (
    <>
    <StreamProvider>
     <BrowserRouter>
     <Routes>
      <Route index path = "/" element={<Login/>} />
      <Route path= "/dashboard" element={<Dashboard/>}>
      <Route path= "home" element={<Home/>} />
      <Route path = "createexam" element={<CreateExam/>} />
      <Route path = "createquiz/:examId/:questionNo" element = {<Createquiz/>} />
      <Route path = "viewquestions/:examId" element ={<ViewQuestions/>} />
      <Route path = "editquestions/:examId" element ={<EditQuestion/>} />
      <Route path = "updatequestion/:examId/:questionId" element ={<UpdateQuestion/>} />
      <Route path = "analysis" element={<Analysis/>} />
      <Route path = "proctoring" element={<Proctor/>} />
      </Route>
      <Route path= "/studentdashboard" element={<StudentDashboard/>}>
      <Route path = "userhome/:studentId" element={<UserHome/>} />
      <Route path = "reports/:studentId" element={<Reports/>} />
      <Route path = "myexams/:studentId" element={<MyExams/>} />
      </Route>
      <Route path = "/register" element={<UserRegister/>} />
      <Route path = "/startexam/:studentId/:examId" element={<StartExam/>} />
      <Route path = "/exam/:studentId/:examId" element={<Exam/>} />
      <Route path = "/endexam" element={<EndExam/>} />
     </Routes>
     </BrowserRouter>
     </StreamProvider>
    </>
  )
}

export default App
