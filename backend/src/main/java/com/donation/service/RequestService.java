package com.donation.service;

import com.donation.dto.Dtos;
import com.donation.entity.*;
import com.donation.enums.RequestStatus;
import com.donation.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RequestService {

    @Autowired
    private RequestRepository requestRepository;
    @Autowired
    private RequestItemRepository requestItemRepository;
    @Autowired
    private FulfillmentRepository fulfillmentRepository;
    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Request createRequest(Dtos.CreateRequestDto dto) {
        User receiver = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Request request = Request.builder()
                .receiver(receiver)
                .title(dto.getTitle())
                .location(dto.getLocation())
                .status(RequestStatus.OPEN)
                .build();

        List<RequestItem> items = dto.getItems().stream().map(itemDto -> RequestItem.builder()
                .request(request)
                .itemName(itemDto.getItemName())
                .requiredQuantity(itemDto.getRequiredQuantity())
                .fulfilledQuantity(0)
                .build()).collect(Collectors.toList());

        request.setItems(items);
        return requestRepository.save(request);
    }

    public List<Request> getAllRequests() {
        return requestRepository.findAll();
    }

    public List<Request> getRequestsByReceiver(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return requestRepository.findByReceiver(user);
    }

    public Request getRequest(Long id) {
        return requestRepository.findById(id).orElseThrow(() -> new RuntimeException("Request not found"));
    }

    @Transactional
    public Fulfillment fulfillRequest(Dtos.FulfillRequestDto dto) {
        User donor = userRepository.findById(dto.getDonorId())
                .orElseThrow(() -> new RuntimeException("Donor not found"));
        RequestItem item = requestItemRepository.findById(dto.getRequestItemId())
                .orElseThrow(() -> new RuntimeException("Item not found"));

        if (item.getFulfilledQuantity() + dto.getQuantity() > item.getRequiredQuantity()) {
            throw new RuntimeException("Quantity exceeds required amount");
        }

        item.setFulfilledQuantity(item.getFulfilledQuantity() + dto.getQuantity());
        requestItemRepository.save(item);

        Fulfillment fulfillment = Fulfillment.builder()
                .donor(donor)
                .requestItem(item)
                .quantity(dto.getQuantity())
                .build();

        updateRequestStatus(item.getRequest());

        return fulfillmentRepository.save(fulfillment);
    }

    private void updateRequestStatus(Request request) {
        boolean allCompleted = request.getItems().stream()
                .allMatch(i -> i.getFulfilledQuantity() >= i.getRequiredQuantity());
        boolean anyStarted = request.getItems().stream()
                .anyMatch(i -> i.getFulfilledQuantity() > 0);

        if (allCompleted) {
            request.setStatus(RequestStatus.COMPLETED);
        } else if (anyStarted) {
            request.setStatus(RequestStatus.PARTIALLY_FULFILLED);
        } else {
            request.setStatus(RequestStatus.OPEN);
        }
        requestRepository.save(request);
    }
}
