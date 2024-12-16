$(function () {
    const nodeListAPI = "http://10.0.4.87:30800/cluster/node-list"; // Node API 주소
    const volumeListAPI = "https://10.0.4.87:30800/cluster/node/volume"; // volume API 주소

    var dbmsType = "OPENCSD";
    var apiEndpoint = "/api/create"; // 파드생성 엔드포인트
    var operationNode = ""; // Section 2에서 선택된 Operation Node
    var storageNode = "";   // Section 2에서 선택된 Storage Node
    var volume = "";        // Section 2에서 선택된 Volume

    var operationNodes = ["Node A", "Node B"]; // 임시 데이터
    var storageNodes = ["Storage A", "Storage B"]; // 임시 데이터
    var volumes = ["Volume 1", "temp", "Add New Volume"]; // 임시 데이터

    $('#wizard').on('stepChanged', function (event, currentIndex) {
        if (currentIndex === 2) { // SECTION 3
            // Get selected values from SECTION 1
            const dbmsType = $('input[name="dbmsType"]:checked').val();
            const dbName = $('#dbName').val() || "DefaultDBName";
            const instanceName = $('#instanceName').val() || "DefaultInstanceName";
            const dbRootPwd = $('#dbRootPassword').val() || "DefaultRootPwd";

            // Get values from SECTION 2
            const operationNode = $("#operationNode").val() || "None";
            const storageNode = $("#storageNode").val() || "None";
            const volume = $("#volume").val() || "None";

            // Update SECTION 3 fields
            $('#selectedDBType').val(dbmsType);
            $('#selectedDBName').val(dbName);
            $('#selectedInstanceName').val(instanceName);
            $('#selectedOperationNode').val(operationNode);
            $('#selectedStorageNode').val(storageNode);
            $('#selectedVolume').val(volume);

            const jsonData = {
                instanceName: instanceName,
                instanceType: dbmsType,
                dbName: dbName,
                dbRootPwd: dbRootPwd,
                operationNode: operationNode,
                storageNode: storageNode,
                volumeName: volume
            };
             // Attach jsonData to the "Create" button for submission
             $("#createBtn").data("jsonData", jsonData);
        }
    });

    $("#wizard").steps({
        headerTag: "h2",
        bodyTag: "section",
        transitionEffect: "fade",
        enableAllSteps: true,
        transitionEffectSpeed: 400,
        labels: {
            finish: "Create",
            next: "Forward",
            previous: "Backward",
        },
    });

    $(".wizard > .steps li a").click(function () {
        $(this).parent().addClass("checked");
        $(this).parent().prevAll().addClass("checked");
        $(this).parent().nextAll().removeClass("checked");
    });

    $(".forward").click(function () {
        $("#wizard").steps("next");
    });
    $(".backward").click(function () {
        $("#wizard").steps("previous");
    });

    // Operation Node Dropdown
    operationNodes.forEach((node) => {
        $("#operationNode").append(
            `<option value="${node}">${node}</option>`
        );
    });

    // Storage Node Dropdown
    $("#storageNode").append(
        '<option value="" disabled selected>Select Storage Node</option>'
    );
    storageNodes.forEach((node) => {
        $("#storageNode").append(
            `<option value="${node}">${node}</option>`
        );
    });

    // Volume Dropdown 초기 상태: 비활성화
    $("#volume").prop("disabled", true);
    $("#volume").append(
        '<option value="" disabled selected>Select Volume</option>'
    );

    function populateNodeDropdowns() {
        $.ajax({
            url: nodeListAPI, // API URL
            type: "GET",
            success: function (response) {
                console.log("Response received:", response);
    
                // 응답이 문자열일 경우 JSON으로 파싱
                if (typeof response === "string") {
                    try {
                        response = JSON.parse(response);
                    } catch (error) {
                        console.error("Failed to parse response as JSON:", error);
                        alert("Error: Invalid response format. Please check the server response.");
                        return;
                    }
                }
    
                // 응답 데이터 검증
                if (!response || !response.nodeList) {
                    console.error("Invalid response format. Expected 'nodeList' property.");
                    alert("Error: Invalid response from server. Please check the API.");
                    return;
                }
    
                const nodeList = response.nodeList;
    
                console.log("Parsed nodeList:", nodeList);
    
                // Operation Node와 Storage Node 초기화
                $("#operationNode").empty().append('<option value="" disabled selected>Select Operation Node</option>');
                $("#storageNode").empty().append('<option value="" disabled selected>Select Storage Node</option>');
    
                // 노드 목록 순회
                for (const key in nodeList) {
                    const node = nodeList[key]; // 현재 노드 데이터
                    console.log("Processing node:", node);
    
                    if (node.layer === "OPERATION") {
                        console.log("Adding to Operation Node dropdown:", node.nodeName);
                        // Operation Node에 추가
                        $("#operationNode").append(
                            `<option value="${node.nodeName}">${node.nodeName} (${node.nodeIp})</option>`
                        );
                    } else if (node.layer === "STORAGE") {
                        console.log("Adding to Storage Node dropdown:", node.nodeName);
                        // Storage Node에 추가
                        $("#storageNode").append(
                            `<option value="${node.nodeName}">${node.nodeName} (${node.nodeIp})</option>`
                        );
                    }
                }
            },
            error: function (error) {
                console.error("Failed to fetch node list:", error);
                alert("Error fetching node list. Please try again later.");
            },
        });
    }
    

    // SECTION 2 - Storage Node 변경 시 Volume 활성화
    $("#storageNode").change(function () {
        const selectedNode = $("#storageNode option:selected").val(); // 드롭다운에서 선택된 값 가져오기

        if (!selectedNode) {
            alert("Please select a valid Storage Node.");
            return;
        }

        $("#volume").prop("disabled", true).empty().append('<option value="" disabled selected>Loading...</option>');
        
        fetch(`http://10.0.4.87:30800/cluster/node/volume?node=${encodeURIComponent(selectedNode)}`)
        .then(response => {
            if (response.ok) {
                return response.json(); // API 응답 JSON 데이터 파싱
            } else {
                throw new Error("Failed to fetch volumes");
            }
        })
        .then(data => {
            // Volume 데이터 추가
            $("#volume").empty().append('<option value="" disabled selected>Select Volume</option>');

            const nodeData = data[selectedNode]; // 노드 데이터 추출
            if (nodeData && nodeData.volumeInfo) {
                const volumes = nodeData.volumeInfo;

                // 각 볼륨 정보를 드롭다운에 추가
                Object.values(volumes).forEach(volume => {
                    const volumeOption = `${volume.volumeName} (${volume.storageType})`;
                    $("#volume").append(`<option value="${volume.volumeName}">${volumeOption}</option>`);
                });

                // Volume 활성화
                $("#volume").prop("disabled", false);
            } else {
                throw new Error("No volume information available");
            }
        })
        .catch(error => {
            console.error("Error fetching volumes:", error);
            alert("Failed to load volumes. Please try again.");
            $("#volume").empty().append('<option value="" disabled selected>No Volumes Available</option>');
        });
    });

    // Volume 비활성화 시 마우스 커서에 금지 표시 추가
    $("#volume").on("mouseenter", function () {
        if ($(this).prop("disabled")) {
            $(this).css("cursor", "not-allowed");
        }
    });

    $("#volume").on("mouseleave", function () {
        $(this).css("cursor", "default");
    });

// DBMS Type 변경 (Show/Hide related form sections)
$(".dbms-type").click(function () {
    var selectedType = $(this).val();
    dbmsType = selectedType;
    if (selectedType === "MYSQL") {
        $(".mysql-form").show();
        $(".opencsd-form").hide();
    } else {
        $(".mysql-form").hide();
        $(".opencsd-form").show();
    }
});

// Final Step: Submit the configuration (API call)
$("#wizard").on("finished", function () {
    // Get the selected DBMS type
    const dbmsType = $("input[name='dbmsType']:checked").val();
    if (!dbmsType) {
        alert("Please select a DB type.");
        return;
    }

    // Prepare JSON data based on selected type
    const jsonData = {
        instanceName: $('#instanceName').val(),  // 인스턴스 이름
        instanceType: dbmsType,  // DBMS 타입 (MYSQL, GRAPHDB 등)
        dbRootPwd: $('#dbRootPassword').val(),  // DB 루트 패스워드
        dbName: $('#dbName').val(),  // DB 이름
        operationNode: $('#operationNode').val(),  // 운영 노드
        storageNode: $('#storageNode').val(),  // 스토리지 노드
        volumeName: $('#volume').val()  // 볼륨 이름
    };

    console.log("Collected JSON Data:", jsonData);

    // API Endpoint based on DB type
    let apiEndpoint;
    if (dbmsType === "MYSQL") {
        apiEndpoint = "http://10.0.4.87:30800/instance/create/mysql";
    } else if (dbmsType === "OPENCSD") {
        apiEndpoint = "http://10.0.4.87:30800/instance/create/opencsd";
    } else if (dbmsType === "GRAPHDB") {
        apiEndpoint = "http://10.0.4.87:30800/instance/create/graphdb";
    } 
    else {
        alert("Invalid DB type selected.");
        return;
    }

    // Send the request
$.ajax({
    url: apiEndpoint,
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(jsonData),
    success: function (response) {
        console.log("API Response:", response);
        /// 성공 메시지 표시
        $('#successMessage').fadeIn();
        // 2초 후 backward 버튼 두 번 클릭
        setTimeout(function() {
            // 첫 번째 backward 클릭
            $('#wizard').steps('previous');
            $('input[type="text"], input[type="password"]').val('');
            $('input[type="radio"]').prop('checked', false);
             $('input[name="dbmsType"][value="OPENCSD"]').prop('checked', true); // 기본값 설정
            
            // 두 번째 backward 클릭
            setTimeout(function() {
                $('#wizard').steps('previous');
            }, 500); // 첫 번째 클릭 후 300ms 후 두 번째 클릭
        }, 2000); // 성공 메시지가 표시된 후 2초 뒤에 실행
    },
    error: function (error) {
        console.error("Error:", error);
        alert("An error occurred while submitting the configuration.");
    }
});
// 클릭 시 메시지가 사라지도록
$('#successMessage').click(function() {
    $(this).fadeOut();
});
});

// Populate node dropdowns on page load
populateNodeDropdowns();
});