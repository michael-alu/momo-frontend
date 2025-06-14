const getAnalysis = async ({ type = "", days = 30 }) => {
  try {
    const params = new URLSearchParams({ type, days });

    const response = await fetch(`${API_URL}/analysis?${params.toString()}`);

    const data = await response.json();

    if (!data.ok) {
      return alert(data.message);
    }

    let datasets = [];

    const labels = data?.data?.type
      ? data?.data?.data?.map(info => info?.date)
      : data?.data?.data?.incoming?.map(info => info?.date);

    if (type) {
      datasets = [
        {
          label: "Transaction Volume",
          backgroundColor: "rgb(20, 74, 108)",
          data: data?.data?.data?.map(info => info?.amount),
          fill: true,
        },
      ];
    } else {
      datasets = [
        {
          label: "Incoming Amount",
          backgroundColor: "rgb(20, 74, 108)",
          data: data?.data?.data?.incoming?.map(info => info?.amount),
          fill: true,
        },
        {
          label: "Outgoing Amount",
          backgroundColor: "rgb(251, 206, 0)",
          data: data?.data?.data?.outgoing?.map(info => info?.amount),
          fill: true,
        },
      ];
    }

    // the chart
    new Chart("myChart", {
      type: "line",
      data: {
        labels,
        datasets,
      },
      options: {
        responsive: true,
        datasets: {
          line: {
            tension: 0.3,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching chart data:", error);
  }
};

getAnalysis({});
