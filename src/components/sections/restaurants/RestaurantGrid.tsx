import styled from "styled-components";
import RestaurantCard from "@components/cards/RestaurantCard";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCompanyStore } from "@/store/company/useCompanyStore";
import moment from "moment";
import getPlaceholderImageUrl from "@/utils/getPlaceholderImageUrl";
import { ApiCompany } from "@/pages/api/companies/[id]";

const gridWidth = 492;
const gapY = 56;
const gapX = 104;
const gridCols = 3;
const maxWidth = gridWidth * gridCols + gapX * (gridCols - 1);

const GridContainer = styled.div`
  max-width: ${maxWidth}px;
  margin: 0 auto;
`;

const Grid = styled.div`
  display: grid;
  gap: ${gapY}px ${gapX}px;
  grid-template-columns: repeat(2, 1fr);

  @media (max-width: 1440px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 1440px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const UnavailableOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(128, 128, 128, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: bold;
`;

const ScheduleButton = styled.button`
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  max-width: 500px;
  width: 100%;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
  background-color: #f2f2f2;
`;

const Td = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
`;

const RestaurantGrid = () => {
  const { companies, fetchCompanies, availableCompanies, updateAvailability } =
    useCompanyStore();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<ApiCompany | null>(
    null
  );

  useEffect(() => {
    console.log(
      "RestaurantGrid: useEffect called, companies length:",
      companies.length
    );

    const fetchData = async () => {
      console.log("RestaurantGrid: fetchData called");
      try {
        await fetchCompanies();
        console.log("RestaurantGrid: fetchCompanies completed");
      } catch (error) {
        console.error("RestaurantGrid: Error in fetchCompanies", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (companies.length === 0) {
      console.log("RestaurantGrid: No companies, calling fetchData");
      fetchData();
    } else {
      console.log("RestaurantGrid: Companies already loaded");
      setIsLoading(false);
    }
  }, [companies.length, fetchCompanies]);

  console.log("RestaurantGrid: Rendering, isLoading:", isLoading);

  const isCompanyAvailable = (companyId: number) => {
    console.log("@/components/sections/restaurants/RestaurantGrid.tsx:114", {
      availableCompanies,
    });
    return availableCompanies.some(
      (company) => Number(company.id) === companyId
    );
  };

  const openScheduleModal = (company: ApiCompany) => {
    setSelectedCompany(company);
  };

  const closeScheduleModal = () => {
    setSelectedCompany(null);
  };

  const handleUpdateAvailability = async () => {
    await updateAvailability();
    console.log(
      "RestaurantGrid: Availability updated",
      availableCompanies.length + " companies available"
    );
  };

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <GridContainer>
      <button onClick={handleUpdateAvailability}>Update Availability</button>
      <Grid>
        {companies.map((data, index) => (
          <div key={index} style={{ position: "relative" }}>
            {isCompanyAvailable(Number(data.id)) ? (
              <Link href={`/restaurantes/${data.id}`}>
                <RestaurantCard
                  companyId={Number(data.id)}
                  imageUrl={getPlaceholderImageUrl({
                    width: 492,
                    height: 400,
                    bgColor: "skyblue",
                    textColor: "white",
                  })}
                  altText={data.description || ""}
                  name={data.name}
                  rating={5}
                  cuisineType={data.type_company.replace(/_/g, " ")}
                  deliveryTime={"5 mins"}
                />
              </Link>
            ) : (
              <div>
                <RestaurantCard
                  companyId={Number(data.id)}
                  imageUrl={getPlaceholderImageUrl({
                    width: 492,
                    height: 400,
                    bgColor: "skyblue",
                    textColor: "white",
                  })}
                  altText={data.description || ""}
                  name={data.name}
                  rating={5}
                  cuisineType={data.type_company.replace(/_/g, " ")}
                  deliveryTime={"5 mins"}
                />
                <UnavailableOverlay>
                  Currently Unavailable
                  <br />
                  Opens:{" "}
                  {data.business_hours[0]?.open
                    ? new Date(data.business_hours[0].open).toLocaleTimeString(
                        [],
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )
                    : "Unknown"}
                </UnavailableOverlay>
              </div>
            )}
            <ScheduleButton onClick={() => openScheduleModal(data)}>
              View Schedule
            </ScheduleButton>
          </div>
        ))}
      </Grid>
      {selectedCompany && (
        <Modal onClick={closeScheduleModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h2>{selectedCompany.name} Schedule</h2>
            <Table>
              <thead>
                <tr>
                  <Th>Day</Th>
                  <Th>Open</Th>
                  <Th>Close</Th>
                </tr>
              </thead>
              <tbody>
                {selectedCompany.business_hours.map((hours, index) => (
                  <tr key={index}>
                    <Td>
                      {moment()
                        .day(Number(hours.day_id) - 1)
                        .format("dddd")}
                    </Td>
                    <Td>
                      {hours.open
                        ? moment(hours.open).format("hh:mm A")
                        : "Closed"}
                    </Td>
                    <Td>
                      {hours.close
                        ? moment(hours.close).format("hh:mm A")
                        : "Closed"}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <button onClick={closeScheduleModal}>Close</button>
          </ModalContent>
        </Modal>
      )}
    </GridContainer>
  );
};

export default RestaurantGrid;
