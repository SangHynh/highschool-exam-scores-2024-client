import "./App.css";
import "./index.css";
import React, { useState } from "react";

function App() {
  const [data, setData] = useState(null);
  const [sbd, setSbd] = useState("");
  const BASE_URL = process.env.REACT_APP_SERVER;

  // Fetch scores from API
  const getScores = (endpoint) => {
    return fetch(`${BASE_URL}/${endpoint}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => setData(data))
      .catch((err) => console.log(err));
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    if (sbd) {
      getScores(sbd);
    }
  };

  // Update SBD state
  const handleChange = (event) => {
    setSbd(event.target.value);
  };

  // Calculate graduation score
  const calculateGraduationScore = (
    toan,
    nguVan,
    ngoaiNgu,
    groupSubjects,
    groupType
  ) => {
    // Total score for independent subjects
    const independentSubjectsTotal = toan + nguVan + ngoaiNgu;

    // Average score for group subjects based on group type
    let groupSubjectsAverage = 0;
    if (groupType === "xa_hoi") {
      groupSubjectsAverage =
        (groupSubjects.lich_su + groupSubjects.dia_li + groupSubjects.gdcd) / 3;
    } else if (groupType === "tu_nhien") {
      groupSubjectsAverage =
        (groupSubjects.vat_li +
          groupSubjects.hoa_hoc +
          groupSubjects.sinh_hoc) /
        3;
    }

    // Calculate total graduation score
    return independentSubjectsTotal + groupSubjectsAverage;
  };

  // Render scores
  const renderScores = () => {
    if (!data || !data.score) {
      return <p>No results available.</p>;
    }

    const { score } = data;
    const { group_type } = score;

    // Define basic subjects to display
    let subjects = ["toan", "ngu_van", "ngoai_ngu"];
    let groupSubjects = {};

    // Add group-specific subjects
    if (group_type === "xa_hoi") {
      subjects = [...subjects, "lich_su", "dia_li", "gdcd"];
      groupSubjects = {
        lich_su: parseFloat(score.lich_su || 0),
        dia_li: parseFloat(score.dia_li || 0),
        gdcd: parseFloat(score.gdcd || 0),
      };
    } else if (group_type === "tu_nhien") {
      subjects = [...subjects, "vat_li", "hoa_hoc", "sinh_hoc"];
      groupSubjects = {
        vat_li: parseFloat(score.vat_li || 0),
        hoa_hoc: parseFloat(score.hoa_hoc || 0),
        sinh_hoc: parseFloat(score.sinh_hoc || 0),
      };
    }

    // Calculate total score
    const totalScore = calculateGraduationScore(
      parseFloat(score.toan),
      parseFloat(score.ngu_van),
      parseFloat(score.ngoai_ngu),
      groupSubjects,
      group_type
    );

    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>Môn học</th>
              <th>Điểm </th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject) => (
              <tr key={subject}>
                <td>{subject.replace("_", " ").toUpperCase()}</td>
                <td>{score[subject]}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h3>Điểm tốt nghiệp: {totalScore.toFixed(2)}</h3>
      </div>
    );
  };

  return (
    <div className="wrapper">
      <div className="background"></div>
      <div className="container">
        <h1 className="title">Kết quả THPT Quốc gia 2024</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nhập số báo danh"
            value={sbd}
            onChange={handleChange}
          />
          <button type="submit">Tìm kiếm</button>
        </form>

        {data && (
          <div>
            <h2>Kết quả</h2>
            {renderScores()}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
