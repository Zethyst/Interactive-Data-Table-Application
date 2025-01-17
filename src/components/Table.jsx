import React, { useEffect, useRef, useState } from "react";
import DataTable from "react-data-table-component";
import Papa from "papaparse";
import DownloadIcon from "@mui/icons-material/Download";

function convertArrayOfObjectsToCSV(array) {
  let result;
  const columnDelimiter = ",";
  const lineDelimiter = "\n";
  const keys = Object.keys(array[0]);
  result = "";
  result += keys.join(columnDelimiter);
  result += lineDelimiter;

  array.forEach((item) => {
    let ctr = 0;
    keys.forEach((key) => {
      if (ctr > 0) result += columnDelimiter;

      result += item[key];

      ctr++;
    });
    result += lineDelimiter;
  });
  return result;
}

function downloadCSV(array) {
  const link = document.createElement("a");
  let csv = convertArrayOfObjectsToCSV(array);
  if (csv == null) return;

  const filename = "export.csv";

  if (!csv.match(/^data:text\/csv/i)) {
    csv = `data:text/csv;charset=utf-8,${csv}`;
  }

  link.setAttribute("href", encodeURI(csv));
  link.setAttribute("download", filename);
  link.click();
}

function Table() {
  const ref = useRef(null);
  const [pending, setPending] = useState(true);
  const [rows, setRows] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data.csv");
        const csvText = await response.text();
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            setRows(result.data);
            setFilteredRows(result.data);
          },
        });
      } catch (error) {
        console.error("Error fetching CSV file:", error);
      } finally {
        setPending(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleClick = () => {
      downloadCSV(rows);
    };

    const element = ref.current;
    if (element) {
      element.addEventListener("click", handleClick);
      return () => {
        element.removeEventListener("click", handleClick);
      };
    }
  }, [rows]);

  const handleSearch = (e) => {
    const text = e.target.value.toLowerCase();
    setSearchText(text);

    const filtered = rows.filter((row) =>
      row["Domain"]?.toLowerCase().includes(text)
    );
    setFilteredRows(filtered);
  };

  const columns = [
    { name: "Domain", selector: (row) => row["Domain"], sortable: true },
    { name: "Niche 1", selector: (row) => row["Niche 1"], sortable: true },
    { name: "Niche 2", selector: (row) => row["Niche 2"], sortable: true },
    { name: "Traffic", selector: (row) => row["Traffic"], sortable: true },
    { name: "DR", selector: (row) => row["DR"], sortable: true },
    { name: "DA", selector: (row) => row["DA"], sortable: true },
    { name: "Language", selector: (row) => row["Language"], sortable: true },
    { name: "Price", selector: (row) => row["Price"], sortable: true },
    {
      name: "Spam Score",
      selector: (row) => row["Spam Score"],
      sortable: true,
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        fontSize: "12px",
        background: "#F1F1F1",
        padding: "10px",
      },
    },
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-500">
      <div className="absolute -left-28 md:left-0 py-5 px-5 bg-white shadow-md h-[80%] w-[80%] translate-x-36 rounded-2xl flex gap-5 flex-col justify-center items-center">
        {/* Search Input */}
        <div
          className={`${
            pending ? "hidden" : ""
          } w-full flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-center`}
        >
          <input
            type="text"
            placeholder="Search by Domain Name"
            value={searchText}
            onChange={handleSearch}
            className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 "
          />

          <button
            ref={ref}
            className="flex gap-1 justify-center items-center px-6 py-3 h-11 w-36 text-white bg-[#EB5D50] hover:bg-orange-700 font-bold rounded-3xl"
          >
            <DownloadIcon className="translate-y-[1px]" />
            <p>Download</p>
          </button>
        </div>
        <DataTable
          columns={columns}
          data={filteredRows}
          progressPending={pending}
          customStyles={customStyles}
          fixedHeader
          pagination
          highlightOnHover
          dense
        />
      </div>
    </div>
  );
}

export default Table;
