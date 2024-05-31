import { ExportCurve } from 'iconsax-react';
import * as XLSX from 'sheetjs-style';
import { OutlineButton } from './ui/Button';
import { useSession } from 'next-auth/react';

interface Props {
  exportParams: { search: string, key: string, value: string };
}

const ExportExcel: React.FC<Props> = ({ exportParams }) => {
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';
  const { data: session } = useSession();

  const exportToExcel = async () => {
    try {
      const access_token = session?.user?.access_token;
      const { search, key, value } = exportParams;
      const currentDate = new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      const fileName = `Data-Warga-${key}-${value}-${currentDate}`;
      const baseEndpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/data/nik`;
      const queryString = `?search=${search}${key ? `&${key}=${value}` : ''}`;

      const initialResponse = await fetch(`${baseEndpoint}${queryString}&page=1`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (!initialResponse.ok) {
        console.error('Error fetching data:', initialResponse.statusText);
        return;
      }

      const initialResult = await initialResponse.json();
      const totalPages = initialResult.pages;

      const allData = [];
      for (let page = 1; page <= totalPages; page++) {
        const response = await fetch(`${baseEndpoint}${queryString}&page=${page}`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        if (!response.ok) {
          console.error('Error fetching data:', response.statusText);
          return;
        }

        const result = await response.json();
        const dataWithLocalTime = result.data.map((item: { createdAt: string | number | Date; updatedAt: string | number | Date; }) => ({
          ...item,
          createdAt: new Date(item.createdAt).toLocaleString('id-ID', {
            timeZone: 'Asia/Jakarta',
          }),
          updatedAt: new Date(item.updatedAt).toLocaleString('id-ID', {
            timeZone: 'Asia/Jakarta',
          }),
        }));

        allData.push(...dataWithLocalTime);
      }

      const ws = XLSX.utils.json_to_sheet(allData);
      ws['!cols'] = [
        { wch: 5 },
        { wch: 5 },
        { wch: 18 },
        { wch: 18 },
        { wch: 16 },
        { wch: 16 },
        { wch: 10 },
        { wch: 10 },
        { wch: 30 },
        { wch: 4 },
        { wch: 4 },
        { wch: 8 },
        { wch: 12 },
        { wch: 6 },
        { wch: 10 },
        { wch: 20 },
        { wch: 20 },
      ];

      const headerRange = XLSX.utils.decode_range(ws['!ref']!);
      for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
        const headerCell = XLSX.utils.encode_cell({ r: headerRange.s.r, c: C });

        if (ws[headerCell]) {
          ws[headerCell].s = { font: { bold: true }, alignment: { wrapText: true } };
        }
      }
      const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

      const blob = new Blob([excelBuffer], { type: fileType });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = fileName + fileExtension;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  return (
    <OutlineButton className='hidden md:block' onClick={exportToExcel}>
      <ExportCurve size={16} />
      <span className='hidden md:block text-xs'>
        Export
      </span>
    </OutlineButton>
  );
};

export default ExportExcel;
