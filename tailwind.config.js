module.exports = {
    theme: {
      extend: {
        maskImage: {
          'fade-bottom': 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 70%, rgba(0, 0, 0, 0) 100%)',
        },
      },
    },
    plugins: [
      function({ addUtilities }) {
        const newUtilities = {
          '.mask-fade-bottom': {
            '-webkit-mask-image': 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 70%, rgba(0, 0, 0, 0) 100%)',
            'mask-image': 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 70%, rgba(0, 0, 0, 0) 100%)',
          },
        }
        addUtilities(newUtilities)
      }
    ],
  }