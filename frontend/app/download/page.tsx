
"use client";

import { useEffect, useMemo, useState } from "react";
import { FaMapMarkerAlt, FaFileAlt, FaDownload, FaTrash } from "react-icons/fa";
import { getApiUrl } from "@/lib/api";
import axios from "axios";
// app/layout.tsx
// import "./globals.css";
import { FaCheckSquare, FaRegSquare } from "react-icons/fa";
import { MdOutlineDeselect } from "react-icons/md";

const REPORT_TYPES = [
  "AHD Report",
  "Biometric Data",
  "Client Verification Report",
  "Clinic Data Report",
  "EAC Report",
  "Family Index Testing Report",
  "HTS Report",
  "Laboratory Data",
  "Longitudinal PrEP Report",
  "Patient List",
  "Pharmacy Data",
  "PMTCT HTS",
  "PMTCT Maternal Cohort",
  "PrEP Cross Sectional",
  "RADET",
  "TB Longitudinal Report",
];

export default function UploadPage() {
  const [states, setStates] = useState<string[]>([]);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);

  const [stateData, setStateData] = useState<any>({});
  // const [expandedState, setExpandedState] = useState<string | null>(null);
  const [expandedStates, setExpandedStates] = useState<string[]>([]);
  const [expandedLga, setExpandedLga] = useState<string | null>(null);

  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [reports, setReports] = useState(REPORT_TYPES);

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [loadingStates, setLoadingStates] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;


    useEffect(() => {
    const fetchStates = async () => {
      try {
        setLoadingStates(true);

        // const API_URL = await getApiUrl();

        const res = await axios.get(`${API_URL}/states-full`);

        const data = res.data;
        setStateData(data);
        setStates(Object.keys(data));

        // setStates(Object.keys(data));
        // 👉 if you're using LGAs:
        // setStateData(data);

      } catch (err) {
        console.error("Failed to load states", err);
      } finally {
        setLoadingStates(false);
      }
    };

    fetchStates();
  }, []);




  // ---------------- STATE SELECT ----------------
  // const toggleState = (state: string, e: React.MouseEvent) => {
  //   const isCtrl = e.ctrlKey || e.metaKey;

  //   if (!isCtrl) {
  //     // setSelectedStates([state]);
  //     setSelectedStates([state]);
  //     setExpandedState(state);
  //     setExpandedLga(null);
  //     return;
  //   }

  //   setSelectedStates((prev) =>
  //     prev.includes(state)
  //       ? prev.filter((s) => s !== state)
  //       : [...prev, state]
  //   );
  // };

  const toggleFacility = (facility: string) => {
    setSelectedFacilities((prev) =>
      prev.includes(facility)
        ? prev.filter((f) => f !== facility)
        : [...prev, facility]
    );
  };



  const toggleState = (state: string, e: React.MouseEvent) => {
  const isCtrl = e.ctrlKey || e.metaKey;

  if (!isCtrl) {
    setSelectedStates([state]);
    setExpandedStates([state]); // ✅ only this state open
    setExpandedLga(null);
    return;
  }

  setSelectedStates((prev) => {
    const exists = prev.includes(state);

    const updated = exists
      ? prev.filter((s) => s !== state)
      : [...prev, state];

    // ✅ sync expanded states with selected ones
    setExpandedStates(updated);

    return updated;
  });
};

  // ---------------- REPORT SELECT ----------------
  const toggleReport = (report: string) => {
    setSelectedReports((prev) =>
      prev.includes(report)
        ? prev.filter((r) => r !== report)
        : [...prev, report]
    );
  };

  // ---------------- DELETE REPORT ----------------
  const deleteReport = (report: string) => {
    setReports((prev) => prev.filter((r) => r !== report));
    setSelectedReports((prev) => prev.filter((r) => r !== report));
  };

  // ---------------- FILTER REPORTS ----------------
  const filteredReports = useMemo(() => {
    return reports.filter((r) =>
      r.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, reports]);

  // ---------------- DOWNLOAD ----------------
  const handleDownload = async () => {
    if (!selectedStates.length || !selectedReports.length) {
      alert("Select at least one state and one report");
      return;
    }

    setLoading(true);

    try {

      const statesParam = [...new Set(selectedStates)].join(",");
      const reportsParam = [...new Set(selectedReports)].join(",");

      // const API_URL = await getApiUrl();

      // const res = await axios.get(
      //     `${API_URL}/reports/merge-download`,
      //     {
      //       params: {
      //         states: statesParam,
      //         reports: reportsParam,
      //       },
      //       responseType: "blob",
      //     }
      //   );

      const res = await axios.post(
        `${API_URL}/reports/merge-download`,
        {
          states: selectedStates,
          reports: selectedReports,
          facilities: selectedFacilities,
        },
        {
          responseType: "blob",
        }
      );

        const downloadUrl = window.URL.createObjectURL(new Blob([res.data]));

        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = "merged_report.csv";
        // a.download = `merged_${selectedStates.length}_states_${selectedReports.length}_reports.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();




      window.URL.revokeObjectURL(downloadUrl);
    } catch {
      alert("Error downloading report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full px-6 py-10 bg-white">

      {/* HEADER */}
    {/* HEADER */}
    <div className="mb-6 pb-5 border-b border-gray-100 flex items-start justify-between">

      {/* LEFT SIDE */}
      <div>
        <h1 className="text-xl font-semibold text-gray-800 tracking-wide">
          Report Download
        </h1>

        <p className="text-[15px] text-gray-500 mt-2">
          Select states, view LGAs & facilities
        </p>
      </div>

      {/* RIGHT SIDE (DOWNLOAD BUTTON) */}
        <button
          onClick={handleDownload}
          disabled={loading}
          className={`px-3 py-[5px] text-xs rounded transition flex items-center gap-1
            ${
              loading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-900 text-white hover:bg-black"
            }`}
        >

          <FaDownload size={12} />

          {loading ? "Generating..." : "Download"}

        </button>

    </div>

      {/* GRID */}
    {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-2"> */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 h-[calc(40vh-120px)] overflow-hidden">

        {/* STATES CARD */}
        {/* <div className="bg-white border border-gray-100 rounded p-2"> */}
        <div className="border border-gray-100 rounded p-2">

          {/* HEADER */}
          <div className="flex items-center gap-2 text-[14px] font-medium text-gray-700 pb-2 border-b border-gray-100">

            <FaMapMarkerAlt size={15} />

            <span>States</span>

            <span className="ml-auto text-[14px] bg-gray-100 text-gray-600 px-1.5 py-[1px] rounded">
              {selectedStates.length}
            </span>
          </div>

          {/* STATES */}
          <div className="flex flex-wrap gap-1 mt-2 mb-2">
            {states.map((state) => {
              const active = selectedStates.includes(state);

              return (
                <button
                  key={state}
                  onClick={(e) => toggleState(state, e)}
                  className={`px-2 py-[2px] text-[12px] rounded border transition
                    ${
                      active
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                    }`}
                >
                  {state}
                </button>

                
              );
            })}



          </div>
           {/* {expandedStates.map((state) => (
            stateData[state] && (
              <div key={state} className="mt-3 border-t pt-3 w-full"> */}

       {selectedStates.map((state) => (
  stateData[state] && (
    <div key={state} className="mb-4">

    <h3
      className={`text-xs font-medium text-gray-600 mb-2 pb-2 border-b transition pl-2
        ${
          selectedStates.includes(state)
            ? "border-gray-100"
            : "border-transparent"
        }`}
    >
      LGAs in {state}
    </h3>

      {/* SCROLLABLE LGA LIST */}
      <div className="space-y-2 pr-1 max-h-[25vh] overflow-y-auto custom-scrollbar">

        {Object.entries(stateData[state]).map(([lga, facilities]: any) => {

          const lgaKey = `${state}-${lga}`;

          return (
            <div key={lga}>

              {/* LGA ROW */}
              <div
                onClick={() =>
                  setExpandedLga(
                    expandedLga === lgaKey ? null : lgaKey
                  )
                }
                className="w-full flex items-center justify-between px-2 py-1 text-xs rounded hover:bg-gray-100 transition cursor-pointer group"
              >
                <span>{lga}</span>

                {/* ACTION ICONS */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">

                  {/* SELECT ALL */}
                 {/* SELECT ALL */}
<button
  onClick={(e) => {
    e.stopPropagation();

    const facilityKeys = facilities.map(
      (f: string) => `${state}||${lga}||${f}`
    );

    setSelectedFacilities((prev) => [
      ...new Set([...prev, ...facilityKeys]),
    ]);
  }}
  className="text-green-600 hover:text-green-800"
  title="Select all"
>
  <FaCheckSquare size={12} />
</button>

{/* DESELECT ALL */}
<button
  onClick={(e) => {
    e.stopPropagation();

    const facilityKeys = facilities.map(
      (f: string) => `${state}||${lga}||${f}`
    );

    setSelectedFacilities((prev) =>
      prev.filter((f) => !facilityKeys.includes(f))
    );
  }}
  className="text-red-500 hover:text-red-700"
  title="Deselect all"
>
  <MdOutlineDeselect size={14} />
</button>

                </div>
              </div>

              {/* FACILITIES */}
              {expandedLga === lgaKey && (
                <div className="ml-3 mt-1 space-y-1">
                  {facilities.map((facility: string) => {

                    const key = `${state}||${lga}||${facility}`;
                    const active = selectedFacilities.includes(key);

                    return (
                      <div
                        key={facility}
                        onClick={() => {
                          setSelectedFacilities((prev) =>
                            prev.includes(key)
                              ? prev.filter((f) => f !== key)
                              : [...prev, key]
                          );
                        }}
                        className={`text-[11px] px-2 py-[2px] rounded cursor-pointer flex items-center gap-1
                          ${
                            active
                              ? "bg-gray-900 text-white"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                      >
                        <input
                          type="checkbox"
                          checked={active}
                          readOnly
                          className="accent-black"
                        />
                        {facility}
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          );
        })}

      </div>
    </div>
  )
))}





        </div>
        

        {/* REPORTS CARD */}
        {/* <div className="bg-white border border-gray-100 rounded p-2 lg:col-span-2 flex flex-col"> */}
        <div className="border border-gray-100 rounded p-2 lg:col-span-2 flex flex-col">

          {/* HEADER */}
          <div className="flex items-center gap-2 text-[14px] font-medium text-gray-700 pb-2 border-b border-gray-100">

            <FaFileAlt size={15} />

            <span>Reports</span>

            {/* <span className="ml-auto text-[14px] bg-green-50 text-green-700 px-1.5 py-[1px] rounded">
              {selectedReports.length}
            </span> */}
            <span className="ml-auto text-[12px] bg-gray-100 text-gray-700 px-2 py-[2px] rounded-full font-medium border border-gray-200">
            {selectedReports.length}
          </span>

          </div>

          {/* ACTIONS */}
            {/* ACTIONS + SEARCH (SAME ROW) */}
            <div className="flex items-center justify-between gap-2 mt-2 mb-2 flex-wrap">

              {/* LEFT: BUTTONS */}
              <div className="flex gap-1 flex-wrap">

                <button
                  onClick={() => setSelectedReports(REPORT_TYPES)}
                  className="px-2 py-[2px] text-[12px] border border-gray-200 bg-white text-gray-700 rounded hover:bg-gray-50 transition"
                >
                  All
                </button>

                <button
                  onClick={() => setSelectedReports([])}
                  className="px-2 py-[2px] text-[12px] border border-gray-200 bg-white text-gray-700 rounded hover:bg-gray-50 transition"
                >
                  None
                </button>

                <button
                  onClick={() => {
                    setSelectedReports([]);
                    setReports([]);
                  }}
                  className="px-2 py-[2px] text-[12px] border border-red-100 bg-white text-red-600 rounded hover:bg-red-50 transition"
                >
                  Clear
                </button>

              </div>

              {/* RIGHT: SEARCH */}
              <div className="w-full sm:w-64">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search reports..."
                className="w-full px-2 py-[4px] text-xs bg-white border border-gray-200 rounded outline-none focus:border-gray-300 transition"
              /> 
              </div>

            </div>



        {/* LIST */}
          {/* <div className="flex-1 overflow-auto space-y-1 max-h-[16vh] pr-1"> */}
          {/* LIST */}
        <div className="flex-1 overflow-auto space-y-1 max-h-[16vh] pr-1 bg-white rounded">

            {filteredReports.map((report) => {
              const active = selectedReports.includes(report);

              return (
                <div
                  key={report}
                  className={`group flex items-center justify-between px-2 py-[4px] text-[12px] rounded transition
                    ${
                      active
                        ? "bg-gray-100"
                        : "hover:bg-gray-100"
                    }`}
                >

                  {/* ITEM */}
                  <div
                    onClick={() => toggleReport(report)}
                    className="flex-1 cursor-pointer text-gray-800 truncate"
                  >
                    {report}
                  </div>

                  {/* DELETE */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteReport(report);
                    }}
                    className="text-red-500 opacity-0 group-hover:opacity-100 transition"
                  >
                    <FaTrash size={10} />
                  </button>

                </div>
              );
            })}

          </div>
        </div>

      </div>





      {/* DOWNLOAD */}
      <div className="mt-2 flex justify-end">

      


      </div>

    </div>
    
  );
  
}