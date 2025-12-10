export const chartColors = {
  red: '#1C7CEB',
  darkRed: '#09223B',
  blue: '#2BA3E7',
  purple: '#59A66B',
  green: '#59A66B',
  amber: '#2BA3E7',
  border: 'rgba(255,255,255,0.25)',
  grid: 'rgba(255,255,255,0.08)',
  label: '#F5F7FA',
  tooltipBg: '#0B1A30',
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
