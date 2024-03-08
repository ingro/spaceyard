// export function updateFilterValue(id: string, value: any): any {
//     return (filters: any) => {
//         const newArray = [].concat(...filters);
//         const index = newArray.findIndex((obj: any) => obj.id === id);

//         if (index !== -1) {
//             // @ts-ignore
//             newArray[index].value = value;
//         } else {
//             // @ts-ignore
//             return newArray.concat({ id, value });
//         }

//         return newArray;
//     }
// }