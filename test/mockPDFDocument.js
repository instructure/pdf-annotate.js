import mockPDFPage from './mockPDFPage';

export default function mockPDFDocument() {
  return {
    getPage: function (pageNumber) {
      return new Promise((resolve, reject) => {
        resolve(mockPDFPage());
      });
    }
  };
}
