


"use client";

// import { useState } from "react";
import {
  Upload,
  BrainCircuit,
  AlertTriangle,
  FileText,
  Database,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";



export default function Dashboard() {
    const [active, setActive] = useState("Upload Dataset");

    const [file, setFile] = useState<File | null>(null);

    const [message, setMessage] = useState("");

    const [uploading, setUploading] = useState(false);

    const [showProgress, setShowProgress] = useState(false);

    const [progress, setProgress] = useState(0);

    const [currentStep, setCurrentStep] = useState("");

    const [completedSteps, setCompletedSteps] = useState<string[]>([]);




    const [countryFilter, setCountryFilter] = useState("");

    const [statusFilter, setStatusFilter] = useState("");

    const [yearFilter, setYearFilter] = useState("");

    const [indicatorFilter, setIndicatorFilter] = useState("");

    const [sexFilter, setSexFilter] = useState("");

    const [ageFilter, setAgeFilter] = useState("");


    const [summary, setSummary] = useState<any>(null);
    const [models, setModels] = useState<any[]>([]);
    const [countries, setCountries] = useState<any[]>([]);
    const [years, setYears] = useState<any[]>([]);
    const [indicators, setIndicators] = useState<any[]>([]);
    const [sex, setSex] = useState<any[]>([]);
    const [ages, setAges] = useState<any[]>([]);
    const [table, setTable] = useState<any[]>([]);
    const [loadingResults, setLoadingResults] = useState(false);


    const [page, setPage] = useState(1);

    const [pageSize] = useState(10);

    const [totalRows, setTotalRows] = useState(0);


    useEffect(() => {

      if (active === "View Anomalies") {

          loadResults(page);

      }

  }, [

      active,

      page,

      countryFilter,

      statusFilter,

      yearFilter,

      indicatorFilter,

      sexFilter,

      ageFilter

  ]);


 

  // async function downloadReport() {

  //     const response = await fetch(
  //         "http://localhost:8000/results/download"
  //     );

  //     const blob = await response.blob();

  //     const url = window.URL.createObjectURL(blob);

  //     const link = document.createElement("a");

  //     link.href = url;

  //     link.download = "Vaccination_Anomaly_Report.xlsx";

  //     document.body.appendChild(link);

  //     link.click();

  //     link.remove();

  //     window.URL.revokeObjectURL(url);
  // }

  async function downloadReport() {
    const response = await fetch("/results/download");

    if (!response.ok) {
      throw new Error(`Download failed: ${response.status}`);
    }

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "Vaccination_Anomaly_Report.xlsx";

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
  }

  // async function loadResults(currentPage = page) {
    
  //   setLoadingResults(true);

  //   try {

  //       const [

  //           summaryRes,
  //           modelsRes,
  //           countryRes,
  //           yearRes,
  //           indicatorRes,
  //           sexRes,
  //           ageRes,
  //           tableRes

  //       ] = await Promise.all([

  //           fetch("http://localhost:8000/results/summary"),
  //           fetch("http://localhost:8000/results/models"),
  //           fetch("http://localhost:8000/results/country"),
  //           fetch("http://localhost:8000/results/year"),
  //           fetch("http://localhost:8000/results/indicator"),
  //           fetch("http://localhost:8000/results/sex"),
  //           fetch("http://localhost:8000/results/age"),
  //           // fetch("http://localhost:8000/results/table")

  //               fetch(
  //               `http://localhost:8000/results/table?page=${currentPage}&size=${pageSize}`
  //           )
            
        
  //       ]);


// async function loadResults(currentPage = page) {

//   setLoadingResults(true);

//   try {

//     const params = new URLSearchParams();

//     params.append(
//       "page",
//       String(currentPage)
//     );

//     params.append(
//       "size",
//       String(pageSize)
//     );

//     // Country filter

//     if (countryFilter) {

//       params.append(
//         "country",
//         countryFilter
//       );

//     }

//     // Status filter

//     if (statusFilter) {

//       params.append(
//         "status",
//         statusFilter
//       );

//     }


//     const [
//       summaryRes,
//       modelsRes,
//       countryRes,
//       yearRes,
//       indicatorRes,
//       sexRes,
//       ageRes,
//       tableRes

//     ] = await Promise.all([

//       fetch(
//         "http://localhost:8000/results/summary"
//       ),

//       fetch(
//         "http://localhost:8000/results/models"
//       ),

//       fetch(
//         "http://localhost:8000/results/country"
//       ),

//       fetch(
//         "http://localhost:8000/results/year"
//       ),

//       fetch(
//         "http://localhost:8000/results/indicator"
//       ),

//       fetch(
//         "http://localhost:8000/results/sex"
//       ),

//       fetch(
//         "http://localhost:8000/results/age"
//       ),

//       fetch(
//         `http://localhost:8000/results/table?${params.toString()}`
//       )


//     ]);



  async function loadResults(currentPage = page) {
    setLoadingResults(true);

    try {
      const params = new URLSearchParams();

      params.append("page", String(currentPage));
      params.append("size", String(pageSize));

      // Country filter
      if (countryFilter) {
        params.append("country", countryFilter);
      }

      // Status filter
      if (statusFilter) {
        params.append("status", statusFilter);
      }

      // const [
      //   summaryRes,
      //   modelsRes,
      //   countryRes,
      //   yearRes,
      //   indicatorRes,
      //   sexRes,
      //   ageRes,
      //   tableRes
      // ] = await Promise.all([
      //   fetch("/results/summary"),

      //   fetch("/results/models"),

      //   fetch("/results/country"),

      //   fetch("/results/year"),

      //   fetch("/results/indicator"),

      //   fetch("/results/sex"),

      //   fetch("/results/age"),

      //   fetch(`/results/table?${params.toString()}`)
      // ]);


      const [
        summaryRes,
        modelsRes,
        countryRes,
        yearRes,
        indicatorRes,
        sexRes,
        ageRes,
        tableRes
      ] = await Promise.all([

        fetch("/api/results/summary"),

        fetch("/api/results/models"),

        fetch("/api/results/country"),

        fetch("/api/results/year"),

        fetch("/api/results/indicator"),

        fetch("/api/results/sex"),

        fetch("/api/results/age"),

        fetch(`/api/results/table?${params.toString()}`)

      ]);

      // ... rest of your existing code




    const summaryData =
      await summaryRes.json();

    const modelsData =
      await modelsRes.json();

    const countriesData =
      await countryRes.json();

    const yearsData =
      await yearRes.json();

    const indicatorsData =
      await indicatorRes.json();

    const sexData =
      await sexRes.json();

    const agesData =
      await ageRes.json();

    const tableData =
      await tableRes.json();


    setSummary(summaryData);

    setModels(modelsData);

    setCountries(countriesData);

    setYears(yearsData);

    setIndicators(indicatorsData);

    setSex(sexData);

    setAges(agesData);


    setTable(
      Array.isArray(tableData.rows)
        ? tableData.rows
        : []
    );


    setTotalRows(
      tableData.total || 0
    );


  } catch (error) {

    console.error(
      "Error loading results:",
      error
    );

  } finally {

    setLoadingResults(false);

  }

}
//         // Convert all responses to JSON
//         const summaryData = await summaryRes.json();
//         const modelsData = await modelsRes.json();
//         const countriesData = await countryRes.json();
//         const yearsData = await yearRes.json();
//         const indicatorsData = await indicatorRes.json();
//         const sexData = await sexRes.json();
//         const agesData = await ageRes.json();
//         // const tableData = await tableRes.json();
//         const tableData = await tableRes.json();

//         // Update state
//         setSummary(summaryData);
//         setModels(modelsData);
//         setCountries(countriesData);
//         setYears(yearsData);
//         setIndicators(indicatorsData);
//         setSex(sexData);
//         setAges(agesData);

//         // IMPORTANT: only store the rows array
//         // setTable(Array.isArray(tableData.rows) ? tableData.rows : []);
//         setTable(Array.isArray(tableData.rows) ? tableData.rows : []);

//         setTotalRows(tableData.total || 0);

//     } catch (err) {

//         console.error("Error loading results:", err);

//     } finally {

//         setLoadingResults(false);

//     }

// }

  // async function loadTable(currentPage: number) {

  //     const response = await fetch(
  //         `http://localhost:8000/results/table?page=${currentPage}&size=${pageSize}`
  //     );

  //     const data = await response.json();

  //     setTable(data.rows);

  //     setTotalRows(data.total);

  // }

  //     useEffect(() => {

  //       if (active === "View Anomalies") {

  //           loadTable(page);

  //       }

  //   }, [page]);


async function loadTable(currentPage: number) {

    setLoadingResults(true);

    try {

        const params = new URLSearchParams();

        params.append(
            "page",
            currentPage.toString()
        );

        params.append(
            "size",
            pageSize.toString()
        );

        if (countryFilter) {

            params.append(
                "country",
                countryFilter
            );

        }

        if (statusFilter) {

            params.append(
                "status",
                statusFilter
            );

        }

        // const response = await fetch(
        //     `http://localhost:8000/results/table?${params.toString()}`
        // );

        const response = await fetch(
            `/results/table?${params.toString()}`
        );

        if (!response.ok) {

            throw new Error(
                "Failed to load table"
            );

        }

        const data = await response.json();

        setTable(
            Array.isArray(data.rows)
                ? data.rows
                : []
        );

        setTotalRows(
            data.total || 0
        );

    } catch (error) {

        console.error(
            "Error loading table:",
            error
        );

        setTable([]);

        setTotalRows(0);

    } finally {

        setLoadingResults(false);

    }
}



  async function uploadDataset() {
    if (!file) {
      setMessage("Please select a CSV file");
      return;
    }
    setShowProgress(true);

    setCompletedSteps([]);

    setProgress(0);


    const formData = new FormData();
      formData.append("file", file);

      setUploading(true);
      setMessage("");

      try {
        const response = await fetch(
          "/api/dataset/upload",
          {
            method: "POST",
            body: formData,
          }
        );

      const data = await response.json();
      const progressSteps = [

        "Dataset Uploaded",

        "Saving Results"

    ];

    for (let i = 0; i < progressSteps.length; i++) {

        setCurrentStep(progressSteps[i]);

        await new Promise(resolve =>

            setTimeout(resolve, 500)

        );

        setCompletedSteps(prev => [

            ...prev,

            progressSteps[i]

        ]);

        setProgress(

            Math.round(

                ((i + 1) / progressSteps.length) * 100

            )

        );

    }

    setTimeout(() => {

        setShowProgress(false);

    }, 800);

      if (!response.ok) {
        throw new Error(data.detail || "Upload failed");
      }
      await loadResults();

      setActive("View Anomalies");

      setMessage(
        `${data.message} | Rows: ${data.rows} | Columns: ${data.columns}`
      );
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setUploading(false);
    }
  }
  

  const steps = [

    "Dataset Uploaded",

    "Cleaning Dataset",

    "Data Preprocessing",

    "Isolation Forest",

    "Local Outlier Factor",

    "One-Class SVM",

    "DBSCAN",

    "K-Means",

    "Combined Voting",

    "Saving Results"

  ];

  const menu = [
    {
      name: "Upload Dataset",
      icon: <Upload />,
    },
    {
      name: "View Anomalies",
      icon: <AlertTriangle />,
    },
    {
      name: "Generate Report",
      icon: <FileText />,
    },
  ];

  return (
    <main className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}

      <aside className="w-72 bg-white shadow-xl p-6">
        <div className="flex items-center gap-3 text-xl font-bold text-blue-700">
          <BrainCircuit />
          AnomalyAI
        </div>

        <nav className="mt-10 space-y-3">
          {menu.map((item) => (
            <button
              key={item.name}
              onClick={() => setActive(item.name)}
              className={`w-full flex items-center gap-3 p-4 rounded-xl transition
              ${
                active === item.name
                  ? "bg-blue-600 text-white"
                  : "hover:bg-blue-100 text-gray-700"
              }`}
            >
              {item.icon}
              {item.name}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}

      <section className="flex-1 p-10">
        <h1 className="text-3xl font-bold text-gray-900">{active}</h1>

        <p className="mt-2 text-gray-500">
          Machine Learning Anomaly Detection Platform
        </p>
      {/* Upload Dataset */}

      {active === "Upload Dataset" && (
        <div className="mt-8 rounded-3xl bg-white shadow-sm border border-gray-200 overflow-hidden">

          {/* Header */}

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 p-8 border-b border-gray-100">

            <div className="flex items-center gap-5">

              <div className="h-16 w-16 rounded-2xl bg-blue-50 flex items-center justify-center">
                <Database className="text-blue-700" size={34} />
              </div>

              <div>

                <p className="mt-1 text-gray-500 max-w-xl">
                  Upload a vaccination dataset in CSV format. Once uploaded,
                  the system will prepare the dataset for anomaly detection.
                </p>

              </div>

            </div>

            <button
              onClick={uploadDataset}
              disabled={!file || uploading}
              className="
              h-12
              px-8
              rounded-xl
              bg-blue-700
              hover:bg-blue-800
              disabled:bg-gray-300
              disabled:cursor-not-allowed
              text-white
              font-medium
              transition
              "
            >
              {uploading ? "Uploading..." : "Upload Dataset"}
            </button>

          </div>

          {/* Upload Area */}

          <div className="p-10">

            <label
              htmlFor="csvUpload"
              className="
              group
              cursor-pointer
              block
              rounded-3xl
              border-2
              border-dashed
              border-gray-300
              hover:border-blue-500
              hover:bg-blue-50/40
              transition-all
              duration-300
              "
            >

              <div className="py-16 px-8 flex flex-col items-center text-center">

                <div
                  className="
                  h-24
                  w-24
                  rounded-full
                  bg-blue-50
                  flex
                  items-center
                  justify-center
                  group-hover:scale-105
                  transition
                  "
                >
                  <Upload
                    size={42}
                    className="text-blue-700"
                  />
                </div>

                <h3 className="mt-8 text-xl font-semibold text-gray-900">
                  Click to upload your dataset
                </h3>

                <p className="mt-3 text-gray-500 max-w-lg leading-relaxed">
                  Select a CSV file containing vaccination records.
                  Supported format: <span className="font-medium">.csv</span>.
                </p>

                <div className="mt-6 inline-flex items-center rounded-xl bg-blue-700 px-6 py-3 text-white font-medium shadow-sm">
                  Choose CSV File
                </div>

              </div>

            </label>

            <input
              id="csvUpload"
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.length) {
                  setFile(e.target.files[0]);
                }
              }}
            />

            {/* Selected File */}

            {file && (

              <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-5">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-4">

                    <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Database
                        size={22}
                        className="text-blue-700"
                      />
                    </div>

                    <div>

                      <p className="font-semibold text-gray-900">
                        {file.name}
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>

                    </div>

                  </div>

                  <span className="rounded-full bg-green-100 px-4 py-1 text-sm font-medium text-green-700">
                    Ready
                  </span>

                </div>

              </div>

            )}

            {/* Status */}

            {message && (
              <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 px-5 py-4">
                <p className="text-blue-700 font-medium">
                  {message}
                </p>
              </div>
            )}

          </div>

        </div>
      )}









        {/* ===== CONTINUE WITH PART 2 HERE ===== */}
                {/* MODEL */}



        {/* ANOMALIES */}

        {active === "View Anomalies" && (
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">

            <div className="flex items-center gap-4">

              <AlertTriangle
                size={45}
                className="text-red-600"
              />

              <div>
                <h2 className="text-2xl font-bold">
                  Detected Anomalies
                </h2>

                <p className="text-gray-500">
                  Results from the anomaly detection model.
                </p>
              </div>

            </div>

            <div className="grid grid-cols-4 gap-5">

              <div className="bg-blue-50 rounded-xl p-5">

              <h3>Total Records</h3>

              <p className="text-3xl font-bold">
              {summary?.total_records}
              </p>

              </div>

              <div className="bg-red-50 rounded-xl p-5">

              <h3>Anomalies</h3>

              <p className="text-3xl font-bold text-red-600">
              {summary?.anomalies}
              </p>

              </div>

              <div className="bg-green-50 rounded-xl p-5">

              <h3>Normal</h3>

              <p className="text-3xl font-bold text-green-600">
              {summary?.normal_records}
              </p>

              </div>

              <div className="bg-purple-50 rounded-xl p-5">

              <h3>Detection Rate</h3>

              <p className="text-3xl font-bold">
              {summary?.detection_rate}%
              </p>

              </div>

              </div>








            {/* ===================== TABLE FILTERS ===================== */}

{/* ===================== FILTERS ===================== */}

<div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-5">

  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

    {/* Country */}

    <div>

      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Region
      </label>

      <select
        value={countryFilter}
        onChange={(e) => {
          setCountryFilter(e.target.value);
          setPage(1);
        }}
        className="
          w-full
          rounded-xl
          border
          border-gray-300
          bg-white
          px-4
          py-3
          text-sm
          text-gray-700
          outline-none
          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-100
        "
      >

        <option value="">
          All Countries
        </option>

        {countries.map((country: any, index: number) => (

          <option
            key={index}
            value={country.REF_AREA}
          >
            {country.REF_AREA}
          </option>

        ))}

      </select>

    </div>


    {/* Status */}

    <div>

      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Status
      </label>

      <select
        value={statusFilter}
        onChange={(e) => {
          setStatusFilter(e.target.value);
          setPage(1);
        }}
        className="
          w-full
          rounded-xl
          border
          border-gray-300
          bg-white
          px-4
          py-3
          text-sm
          text-gray-700
          outline-none
          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-100
        "
      >

        <option value="">
          All Statuses
        </option>

        <option value="Anomaly">
          Anomaly
        </option>

        <option value="Normal">
          Normal
        </option>

      </select>

    </div>


    {/* Clear */}

    <div className="flex items-end">

      <button
        onClick={() => {
          setCountryFilter("");
          setStatusFilter("");
          setPage(1);
        }}
        className="
          w-full
          rounded-xl
          border
          border-gray-300
          bg-white
          px-5
          py-3
          text-sm
          font-medium
          text-gray-700
          hover:bg-gray-100
          transition
        "
      >
        Clear Filters
      </button>

    </div>

  </div>

</div>




            {/* ===================== RESULTS TABLE ===================== */}

<div className="mt-8 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg">

  {/* Table Header */}

  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b bg-gradient-to-r from-slate-50 to-white px-6 py-5 border-gray-100">

    <div>

      <h3 className="text-xl font-bold text-gray-900">
        Anomaly Detection Results
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        Machine learning prediction results for vaccination records.
      </p>

    </div>

    <div className="rounded-full bg-blue-50 px-5 py-2 text-sm font-semibold text-blue-700">

      {totalRows.toLocaleString()} Records

    </div>

  </div>

  {/* Responsive Table */}

  <div className="overflow-x-auto">

    <table className="min-w-full">

      <thead className="sticky top-0 z-10">

        <tr
className="
    bg-emerald-100
    text-emerald-900
    border-b
    border-emerald-100
    
  
"
        >

          <th className="px-6 py-5 text-left text-xs font-semibold uppercase tracking-wider">
            #
          </th>

          <th className="px-6 py-5 text-left text-xs font-semibold uppercase tracking-wider">
            REGION
          </th>

          <th className="px-6 py-5 text-left text-xs font-semibold uppercase tracking-wider">
            Year
          </th>

          <th className="px-6 py-5 text-left text-xs font-semibold uppercase tracking-wider">
            Indicator
          </th>

          <th className="px-6 py-5 text-left text-xs font-semibold uppercase tracking-wider">
            Sex
          </th>

          <th className="px-6 py-5 text-left text-xs font-semibold uppercase tracking-wider">
            Age
          </th>

          <th className="px-6 py-5 text-center text-xs font-semibold uppercase tracking-wider">
            Status
          </th>
          {/* <th className="px-6 py-5 text-center text-xs font-semibold uppercase tracking-wider">
            Reason
          </th> */}

        </tr>

      </thead>

      <tbody>

        {Array.isArray(table) && table.length > 0 ? (

          table.map((row: any, index: number) => (

            <tr
              key={index}
              className="
              border-b
              border-gray-100
              even:bg-slate-50/40
              hover:bg-blue-50/60
              transition-all
              duration-200
              "
          >

              <td className="px-6 py-5">

                <span
                className="
                inline-flex
                items-center
                justify-center
                h-8
                w-8
                rounded-lg
                bg-slate-100
                text-sm
                font-semibold
                text-slate-600
                ">
                    {row.Row}
                </span>

              </td>

              <td className="px-6 py-5">

                <div className="max-w-xs truncate font-medium text-gray-900">

                  {row.REF_AREA}

                </div>

              </td>

              <td className="px-6 py-5 text-gray-700">

                {row.TIME_PERIOD}

              </td>

              <td className="px-6 py-5">

                <div
                  className="max-w-xs truncate text-gray-700"
                  title={row.INDICATOR}
                >

                  {row.INDICATOR}

                </div>

              </td>

              <td className="px-6 py-5 text-gray-700">

                {row.SEX}

              </td>

              <td className="px-6 py-5 text-gray-700">

                {row.AGE}

              </td>

                <td className="px-6 py-5 text-center">

                  {Number(row.Combined_Prediction) === -1 ? (

                    <div className="flex flex-col items-center gap-2">

                      <span
                        className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-full
                        bg-red-100
                        px-4
                        py-2
                        text-xs
                        font-semibold
                        text-red-700
                        "
                      >

                        <span className="h-2 w-2 rounded-full bg-red-600"></span>

                        Anomaly

                      </span>

                    </div>


                  ) : (

                    <span
                      className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-full
                      bg-green-100
                      px-4
                      py-2
                      text-xs
                      font-semibold
                      text-green-700
                      "
                    >

                      <span className="h-2 w-2 rounded-full bg-green-600"></span>

                      Normal

                    </span>

                  )}

                </td>

            </tr>

          ))

        ) : (

          <tr>

            <td
              colSpan={8}
              className="py-16 text-center"
            >

              {loadingResults ? (

                <div className="space-y-3">

                  <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>

                  <p className="text-gray-500">

                    Loading anomaly results...

                  </p>

                </div>

              ) : (

                <div className="space-y-3">

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">

                    📄

                  </div>

                  <p className="text-gray-500">

                    No anomaly results available.

                  </p>

                </div>

              )}

            </td>

          </tr>

        )}

      </tbody>

    </table>

  </div>

</div>

{/* ===================== PAGINATION ===================== */}

<div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-5">

  <div className="text-sm text-gray-500">

    Showing

    <span className="mx-1 font-semibold text-gray-900">

      {(page - 1) * pageSize + 1}

    </span>

    -

    <span className="mx-1 font-semibold text-gray-900">

      {Math.min(page * pageSize, totalRows)}

    </span>

    of

    <span className="ml-1 font-semibold text-blue-700">

      {totalRows.toLocaleString()}

    </span>

    records

  </div>

  <div className="flex items-center gap-3">

    <button
      disabled={page === 1}
      onClick={() => setPage(page - 1)}
      className="
      rounded-xl
      border
      border-gray-200
      bg-white
      px-5
      py-2.5
      text-sm
      font-medium
      text-gray-700
      shadow-sm
      hover:bg-gray-100
      disabled:cursor-not-allowed
      disabled:opacity-40
      transition
      "
    >
      ← Previous
    </button>

    <div
      className="
      rounded-xl
      bg-blue-600
      px-5
      py-2.5
      text-sm
      font-semibold
      text-white
      shadow-md
      "
    >
      Page {page}
    </div>

    <button
      disabled={page * pageSize >= totalRows}
      onClick={() => setPage(page + 1)}
      className="
      rounded-xl
      bg-blue-600
      px-5
      py-2.5
      text-sm
      font-medium
      text-white
      shadow-md
      hover:bg-blue-700
      disabled:bg-gray-300
      disabled:cursor-not-allowed
      transition
      "
    >
      Next →
    </button>

  </div>

</div>


{/* ================= Analytics Dashboard ================= */}

<div className="mt-12 space-y-8">

  <div>
    <h2 className="text-2xl font-bold text-gray-900">
      Anomaly Analytics Dashboard
    </h2>

    <p className="text-gray-500 mt-1">
      Visual summary of detected anomalies.
    </p>
  </div>

  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

    {/* Country */}

    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

      <h3 className="font-semibold text-lg mb-5">
        Anomalies by Country
      </h3>

      <ResponsiveContainer width="100%" height={350}>

        <BarChart data={countries}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="REF_AREA"
            hide
          />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="count"
            radius={[6,6,0,0]}
            fill="#2563eb"
          />

        </BarChart>

      </ResponsiveContainer>

    </div>

    {/* Year */}

    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

      <h3 className="font-semibold text-lg mb-5">
        Anomalies by Year
      </h3>

      <ResponsiveContainer width="100%" height={350}>

        <BarChart data={years}>

          <CartesianGrid strokeDasharray="3 3"/>

          <XAxis dataKey="TIME_PERIOD"/>

          <YAxis/>

          <Tooltip/>

          <Bar
            dataKey="count"
            fill="#3b82f6"
            radius={[6,6,0,0]}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>

    {/* Indicator */}

    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

      <h3 className="font-semibold text-lg mb-5">
        Top 10 Indicators
      </h3>

      <ResponsiveContainer width="100%" height={380}>

        <BarChart
          data={indicators}
          layout="vertical"
        >

          <CartesianGrid strokeDasharray="3 3"/>

          <XAxis type="number"/>

          <YAxis
            dataKey="INDICATOR"
            type="category"
            width={100}
          />

          <Tooltip/>

          <Bar
            dataKey="count"
            fill="#10b981"
            radius={[0,6,6,0]}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>

    {/* Models */}

    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

      <h3 className="font-semibold text-lg mb-5">
        Model Comparison
      </h3>

      <ResponsiveContainer width="100%" height={380}>

        <BarChart data={models}>

          <CartesianGrid strokeDasharray="3 3"/>

          <XAxis dataKey="model"/>

          <YAxis/>

          <Tooltip/>

          <Bar
            dataKey="count"
            fill="#7c3aed"
            radius={[6,6,0,0]}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>

    {/* Sex */}

    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

      <h3 className="font-semibold text-lg mb-5">
        Sex Distribution
      </h3>

      <ResponsiveContainer width="100%" height={330}>

        <PieChart>

          <Pie
            data={sex}
            dataKey="count"
            nameKey="SEX"
            outerRadius={110}
            label
          >

            {sex.map((_, index) => (

              <Cell
                key={index}
                fill={[
                  "#2563eb",
                  "#10b981",
                  "#f59e0b",
                  "#ef4444",
                  "#8b5cf6",
                ][index % 5]}
              />

            ))}

          </Pie>

          <Tooltip/>

        </PieChart>

      </ResponsiveContainer>

    </div>

    {/* Age */}

    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

      <h3 className="font-semibold text-lg mb-5">
        Age Distribution
      </h3>

      <ResponsiveContainer width="100%" height={350}>

        <BarChart data={ages}>

          <CartesianGrid strokeDasharray="3 3"/>

          <XAxis dataKey="AGE"/>

          <YAxis/>

          <Tooltip/>

          <Bar
            dataKey="count"
            fill="#0ea5e9"
            radius={[6,6,0,0]}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>

  </div>

</div>

</div>    










        )}


        




        {/* REPORT */}

        {active === "Generate Report" && (
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">

            <div className="flex items-center gap-4">

              <FileText
                size={45}
                className="text-blue-600"
              />

              <div>

                <h2 className="text-2xl font-bold">
                  Generate Report
                </h2>

                <p className="text-gray-500">
                  Export anomaly detection results as a PDF report.
                </p>

              </div>

            </div>

            {/* <button
              className="
              mt-8
              bg-blue-700
              hover:bg-blue-800
              text-white
              px-8
              py-3
              rounded-xl
              transition
              "
            >
              Download PDF Report
            </button> */}

            <button
              onClick={downloadReport}
              className="
                  mt-8
                  bg-blue-700
                  hover:bg-blue-800
                  text-white
                  px-8
                  py-3
                  rounded-xl
                  transition
              "
          >
              Download Excel Report
          </button>

          </div>
        )}

      </section>
      {
        showProgress && (

        <div className="
        fixed
        inset-0
        z-50
        bg-black/50
        backdrop-blur-sm
        flex
        items-center
        justify-center
        ">

        <div className="
        bg-white
        rounded-3xl
        shadow-2xl
        w-full
        max-w-xl
        p-8
        ">

        <h2 className="text-2xl font-bold text-center">

        Processing Vaccination Report

        </h2>

        <p className="text-gray-500 text-center mt-2">

        Running anomaly detection...

        </p>

        <div className="mt-8">

        <div className="w-full bg-gray-200 rounded-full h-4">

        <div

        className="bg-blue-600 h-4 rounded-full transition-all duration-500"

        style={{

        width: `${progress}%`

        }}

        ></div>

        </div>

        <p className="text-center mt-3 font-semibold">

        {progress}%

        </p>

        </div>

        <div className="mt-8 space-y-3">

        {

        steps.map(step=>(

        <div

        key={step}

        className="flex items-center gap-3"

        >

        {

        completedSteps.includes(step)

        ?

        <span className="text-green-600">

        ✔

        </span>

        :

        currentStep===step

        ?

        <span className="animate-spin">

        ⟳

        </span>

        :

        <span className="text-gray-400">

        ○

        </span>

        }

        <span>

        {step}

        </span>

        </div>

        ))

        }

        </div>

        </div>

        </div>

        )
        }

    </main>
  );
}