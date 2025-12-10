export const chartColors = {
  red: '#C8102E',
  darkRed: '#8E001A',
  blue: '#4F8BFF',
  purple: '#A070FF',
  green: '#76B947',
  amber: '#4F8BFF',
  border: 'rgba(255,255,255,0.2)',
  grid: 'rgba(255,255,255,0.08)',
  label: '#F2F4F7',
  tooltipBg: '#0B162F',
  tooltipBorder: 'rgba(255,255,255,0.14)',
}

const baseFont = {
  family: 'Inter, system-ui, -apple-system, sans-serif',
  size: 13
}

const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      align: 'end',
      labels: {
        color: chartColors.label,
        font: baseFont,
        padding: 14,
      },
    },
    tooltip: {
      backgroundColor: chartColors.tooltipBg,
      borderColor: chartColors.tooltipBorder,
      borderWidth: 1,
      titleColor: '#E5E7EB',
      bodyColor: '#E5E7EB',
      padding: 12,
      cornerRadius: 12,
      titleFont: baseFont,
      bodyFont: baseFont,
    },
  },
  scales: {
    x: {
      grid: {
        color: chartColors.grid,
        drawBorder: false,
      },
      ticks: {
        color: chartColors.label,
        font: baseFont,
      },
    },
    y: {
      grid: {
        color: chartColors.grid,
        drawBorder: false,
      },
      ticks: {
        color: chartColors.label,
        font: baseFont,
      },
      beginAtZero: true,
    },
  },
}

export const chartTheme = (custom = {}) => {
  const merged = {
    ...baseOptions,
    ...custom,
    plugins: {
      ...baseOptions.plugins,
      ...(custom.plugins || {}),
      legend: {
        ...baseOptions.plugins.legend,
        ...(custom.plugins?.legend || {}),
        labels: {
          ...baseOptions.plugins.legend.labels,
          ...(custom.plugins?.legend?.labels || {}),
        },
      },
      tooltip: {
        ...baseOptions.plugins.tooltip,
        ...(custom.plugins?.tooltip || {}),
      },
    },
  }

  if (custom.scales === false) {
    delete merged.scales
  } else {
    merged.scales = {
      ...baseOptions.scales,
      ...(custom.scales || {}),
    }
  }

  return merged
}

export const datasetStyles = (overrideColor) => ({
  borderColor: overrideColor || chartColors.border,
  borderWidth: 1.5,
  borderJoinStyle: 'round',
  borderCapStyle: 'round',
})
