package com.store.doan.api;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.store.doan.constant.MessageError;
import com.store.doan.dto.OrderStatusDTO;
import com.store.doan.dto.OrderedItemDTO;
import com.store.doan.exception.DocumentStorageException;
import com.store.doan.exception.NotFoundException;
import com.store.doan.model.OrderedItem;
import com.store.doan.repository.OrderedItemRepository;
import com.store.doan.security.service.UserDetailsImpl;
import com.store.doan.service.INotificationService;
import com.store.doan.service.IOrderedItemService;

@RestController
@CrossOrigin(origins  = "http://localhost:3000", maxAge = 3600)
public class OrderedItemApi {
	
	
	@Autowired
	IOrderedItemService iOrderedItemService;

	@Autowired
	OrderedItemRepository orderedItemRepository;
	
	@Autowired
	INotificationService iNotificationService;
	
	@Value("${file.upload-dir}")
	String filePath;
	
	@GetMapping("/orders")
	public Page<OrderedItemDTO> paging(Pageable pageable, @RequestParam("boCode") String boCode){
		UserDetailsImpl userDetails =
				(UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		return iOrderedItemService.findBySearch( pageable, boCode, userDetails.getId());
	}
	
	@GetMapping("/orders/{id}")
	public OrderedItemDTO getDetail(@PathVariable("id") Long idQuotation) {
		return iOrderedItemService.viewDetail(idQuotation);
	}
	@GetMapping("/orders/{id}/{idOrderedItemAmdUser}")
	public OrderedItemDTO getDetail(@PathVariable("id") Long idQuotation, @PathVariable("idOrderedItemAmdUser") String idOrderedItemAmdUser) {
		String id[] = idOrderedItemAmdUser.split(",");  
		UserDetailsImpl userDetails =
				(UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		return iOrderedItemService.viewDetailAndChangeStatusNotification(idQuotation, Long.parseLong(id[0]), userDetails.getId());
	}
	@GetMapping("/orders/status")
	public List<OrderStatusDTO> findAll(){
		return iOrderedItemService.findAllStatus();
	}
	
	@PutMapping("/orders/status")
	public void updateStatus(@RequestBody OrderStatusDTO orderedItemDTO) {
		UserDetailsImpl userDetails =
				(UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		iOrderedItemService.updateStatusOrderedItem(userDetails.getId(), orderedItemDTO);
	}
	
	@PutMapping("/orders")
	public OrderedItemDTO update(@RequestParam("idQuotation") Long idQuotation, @RequestParam("name") String name,
			@RequestParam("status") String status, @RequestParam("nameOfCustomer") String nameOfCustomer, @RequestParam("phoneNumber") String phoneNumber,
			@RequestParam("email") String email, @RequestParam("address") String address, @RequestParam("boCode") String boCode,
			@RequestParam("specifications") String specifications, @RequestParam("caculateUnit") String caculateUnit, @RequestParam("quantity") int quantity,
			@RequestParam("deliveryDate") String deliveryDate,
			@RequestParam("price") String price, @RequestParam("note") String note, @RequestParam(name = "file", required = false) MultipartFile file) throws DocumentStorageException {
		UserDetailsImpl userDetails =
				(UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		OrderedItemDTO orderedItemDTO = new OrderedItemDTO();
		
		orderedItemDTO.setIdQuotation(idQuotation);
		orderedItemDTO.setStatus(status);
		if(!"null".equals(name))
			orderedItemDTO.setName(name);
		if(!"null".equals(nameOfCustomer))
			orderedItemDTO.setNameOfCustomer(nameOfCustomer);
		if(!"null".equals(phoneNumber))
			orderedItemDTO.setPhoneNumber(phoneNumber);
		if(!"null".equals(email))
			orderedItemDTO.setEmail(email);
		if(!"null".equals(address))
			orderedItemDTO.setAddress(address);
		if(!"null".equals(boCode))
			orderedItemDTO.setBoCode(boCode);
		if(!"null".equals(specifications))
			orderedItemDTO.setSpecifications(specifications);
		if(!"null".equals(caculateUnit))
			orderedItemDTO.setCaculateUnit(caculateUnit);
		orderedItemDTO.setQuantity(quantity);
		if(!"null".equals(price))
			orderedItemDTO.setPrice(price);
		if(!"null".equals(note))
			orderedItemDTO.setNote(note);
		if(!"null".equals(deliveryDate))
			orderedItemDTO.setDeliveryDate(deliveryDate);
		orderedItemDTO = iOrderedItemService.update(orderedItemDTO, file, userDetails.getId());
		return orderedItemDTO;
	}
	
	
	
	@GetMapping("orders/downloadFile/{id}")
    public ResponseEntity<Resource> downloadFile(@PathVariable("id") Long id,
            HttpServletRequest request) {
        
		OrderedItem orderedItem = orderedItemRepository.findById(id).orElseThrow(() -> new NotFoundException(MessageError.ORDERED_ITEM_NOT_FOUND));
        String fileName = orderedItem.getFilePathDrawing();
        		
        Resource resource = null;
        if(fileName !=null && !fileName.isEmpty()) {
        try {
            resource = iOrderedItemService.loadFileAsResource(fileName);
        } catch (Exception e) {
            e.printStackTrace();
        }
        // Try to determine file's content type
        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException ex) {
            //logger.info("Could not determine file type.");
        }
        // Fallback to the default content type if type could not be determined
        if(contentType == null) {
            contentType = "application/octet-stream";
        }
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    } else {
        return ResponseEntity.notFound().build();
    }
        
    }  
	
}
